import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email sender address - use Resend's default for testing or your verified domain
const FROM_EMAIL = process.env.FROM_EMAIL || 'Cabinet Dr. Martin <onboarding@resend.dev>';

interface AppointmentEmailData {
    patientName: string;
    patientEmail: string;
    date: Date;
    time: string;
    reason?: string;
    cancellationToken?: string;
}

export async function sendConfirmationEmail(data: AppointmentEmailData) {
    // Skip if Resend is not configured
    if (!resend) {
        console.log('⚠️ Email non envoyé (RESEND_API_KEY non configurée)');
        return { success: true, skipped: true };
    }

    const { patientName, patientEmail, date, time, reason, cancellationToken } = data;

    const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const cancellationUrl = cancellationToken
        ? `${baseUrl}/cancel/${cancellationToken}`
        : null;

    try {
        const { data: result, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: patientEmail,
            subject: `Confirmation de votre rendez-vous - Dr. Martin`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Dr. Martin</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Médecin Généraliste</p>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1e40af; margin-top: 0;">Confirmation de rendez-vous</h2>
        
        <p>Bonjour <strong>${patientName}</strong>,</p>
        
        <p>Votre rendez-vous a bien été enregistré. Voici les détails :</p>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <strong style="color: #64748b;">📅 Date</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                        ${formattedDate}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                        <strong style="color: #64748b;">🕐 Heure</strong>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                        ${time}
                    </td>
                </tr>
                ${reason ? `
                <tr>
                    <td style="padding: 10px 0;">
                        <strong style="color: #64748b;">📋 Motif</strong>
                    </td>
                    <td style="padding: 10px 0; text-align: right;">
                        ${reason}
                    </td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
                <strong>📌 Rappel :</strong> Pensez à apporter votre carte Vitale et votre carte de mutuelle.
            </p>
        </div>
        
        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1;">
                <strong>📍 Adresse :</strong><br>
                13, place Alphonse-Fiquet<br>
                80000 Amiens
            </p>
        </div>
        
        ${cancellationUrl ? `
        <div style="text-align: center; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px;">Besoin d'annuler votre rendez-vous ?</p>
            <a href="${cancellationUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Annuler le rendez-vous
            </a>
        </div>
        ` : ''}
    </div>
    
    <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">Cabinet Dr. Martin - Médecin Généraliste</p>
        <p style="margin: 5px 0;">13, place Alphonse-Fiquet, 80000 Amiens</p>
    </div>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Erreur envoi email:', error);
            return { success: false, error };
        }

        console.log('✅ Email de confirmation envoyé à', patientEmail);
        return { success: true, data: result };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error };
    }
}

export async function sendCancellationEmail(data: {
    patientName: string;
    patientEmail: string;
    date: Date;
    time: string;
}) {
    // Skip if Resend is not configured
    if (!resend) {
        console.log('⚠️ Email non envoyé (RESEND_API_KEY non configurée)');
        return { success: true, skipped: true };
    }

    const { patientName, patientEmail, date, time } = data;

    const formattedDate = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: patientEmail,
            subject: `Annulation de votre rendez-vous - Dr. Martin`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #dc2626; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Rendez-vous annulé</h1>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
        <p>Bonjour <strong>${patientName}</strong>,</p>
        
        <p>Votre rendez-vous du <strong>${formattedDate}</strong> à <strong>${time}</strong> a bien été annulé.</p>
        
        <p>Si vous souhaitez reprendre un rendez-vous, vous pouvez le faire directement sur notre site.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book" style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Prendre un nouveau rendez-vous
            </a>
        </div>
    </div>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Erreur envoi email annulation:', error);
            return { success: false, error };
        }

        console.log('✅ Email d\'annulation envoyé à', patientEmail);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur envoi email annulation:', error);
        return { success: false, error };
    }
}
