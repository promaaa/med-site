import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/email';
import { Resend } from 'resend';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Send reminder emails for appointments tomorrow
export async function sendReminderEmails() {
    if (!resend) {
        console.log('⚠️ Rappels non envoyés (RESEND_API_KEY non configurée)');
        return { sent: 0, skipped: true };
    }

    const tomorrow = addDays(new Date(), 1);
    const tomorrowStart = startOfDay(tomorrow);
    const tomorrowEnd = endOfDay(tomorrow);

    try {
        // Find appointments for tomorrow that haven't received a reminder
        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: tomorrowStart,
                    lte: tomorrowEnd,
                },
                status: 'CONFIRMED',
                reminderSent: false,
            },
        });

        let sentCount = 0;

        for (const apt of appointments) {
            try {
                const formattedDate = format(apt.startTime, "EEEE d MMMM yyyy", { locale: fr });
                const formattedTime = format(apt.startTime, "HH:mm");

                await resend.emails.send({
                    from: process.env.FROM_EMAIL || 'Cabinet Dr. Martin <onboarding@resend.dev>',
                    to: apt.patientEmail,
                    subject: `Rappel : Votre rendez-vous demain - Dr. Martin`,
                    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">⏰ Rappel de rendez-vous</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        <p>Bonjour <strong>${apt.patientName}</strong>,</p>
        
        <p>Nous vous rappelons votre rendez-vous <strong>demain</strong> :</p>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #1e40af;">
                ${formattedDate}
            </div>
            <div style="font-size: 32px; font-weight: bold; color: #0f172a; margin: 10px 0;">
                ${formattedTime}
            </div>
            ${apt.reason ? `<div style="color: #64748b;">${apt.reason}</div>` : ''}
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
                <strong>📌 N'oubliez pas :</strong> Carte Vitale et carte de mutuelle
            </p>
        </div>
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px;">
            <p style="margin: 0; color: #0369a1;">
                <strong>📍 Adresse :</strong> 13, place Alphonse-Fiquet, 80000 Amiens
            </p>
        </div>
    </div>
</body>
</html>
                    `,
                });

                // Mark reminder as sent
                await prisma.appointment.update({
                    where: { id: apt.id },
                    data: { reminderSent: true },
                });

                sentCount++;
                console.log(`✅ Rappel envoyé à ${apt.patientEmail}`);
            } catch (error) {
                console.error(`❌ Erreur rappel pour ${apt.patientEmail}:`, error);
            }
        }

        console.log(`📧 ${sentCount} rappel(s) envoyé(s)`);
        return { sent: sentCount };
    } catch (error) {
        console.error('Erreur lors de l\'envoi des rappels:', error);
        return { sent: 0, error };
    }
}

// Send email to admin when appointment is cancelled
export async function sendAdminCancellationNotification(appointment: {
    patientName: string;
    patientEmail: string;
    startTime: Date;
    reason?: string | null;
}) {
    if (!resend) return { success: false, skipped: true };

    try {
        // Get admin email from settings
        const settings = await prisma.settings.findFirst();
        const adminEmail = settings?.adminEmail;

        if (!adminEmail) {
            console.log('⚠️ Pas d\'email admin configuré');
            return { success: false, noAdminEmail: true };
        }

        const formattedDate = format(appointment.startTime, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });

        await resend.emails.send({
            from: process.env.FROM_EMAIL || 'Cabinet Dr. Martin <onboarding@resend.dev>',
            to: adminEmail,
            subject: `⚠️ Annulation RDV - ${appointment.patientName}`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 20px;">
    <h2 style="color: #dc2626;">⚠️ Rendez-vous annulé</h2>
    
    <p>Le patient suivant a annulé son rendez-vous :</p>
    
    <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
            <td style="padding: 8px; font-weight: bold;">Patient :</td>
            <td style="padding: 8px;">${appointment.patientName}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Email :</td>
            <td style="padding: 8px;">${appointment.patientEmail}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Date :</td>
            <td style="padding: 8px;">${formattedDate}</td>
        </tr>
        ${appointment.reason ? `
        <tr>
            <td style="padding: 8px; font-weight: bold;">Motif :</td>
            <td style="padding: 8px;">${appointment.reason}</td>
        </tr>
        ` : ''}
    </table>
    
    <p style="color: #64748b; font-size: 12px;">
        Ce créneau est maintenant disponible pour d'autres patients.
    </p>
</body>
</html>
            `,
        });

        console.log('✅ Notification admin envoyée');
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur notification admin:', error);
        return { success: false, error };
    }
}
