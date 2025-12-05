'use server'

import { prisma } from '@/lib/prisma';
import { listEvents, createEvent, deleteEvent } from '@/lib/googleCalendar';
import { sendConfirmationEmail, sendCancellationEmail } from '@/lib/email';
import { addMinutes, format, parse, isBefore, startOfDay, endOfDay, setHours, setMinutes, addMonths } from 'date-fns';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function getAvailableSlots(dateStr: string) {
    const date = new Date(dateStr);
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    // 1. Get Google Calendar Events
    let googleEvents: any[] = [];
    try {
        googleEvents = await listEvents(startOfDayDate, endOfDayDate);
    } catch (error) {
        console.warn('Google Calendar error (using empty list):', error);
    }

    // 2. Get DB Appointments
    let dbAppointments: any[] = [];
    try {
        dbAppointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: startOfDayDate,
                },
                endTime: {
                    lte: endOfDayDate,
                },
                status: {
                    not: 'CANCELLED',
                },
            },
        });
    } catch (error) {
        console.warn('DB Error (using empty list):', error);
    }

    // 3. Define Working Hours (fetch from DB in future)
    const workStartHour = 9;
    const workEndHour = 17;
    const slotDuration = 30; // minutes

    const slots = [];
    let currentTime = setHours(setMinutes(date, 0), workStartHour);
    const endTime = setHours(setMinutes(date, 0), workEndHour);
    const now = new Date();

    while (isBefore(currentTime, endTime)) {
        const slotEnd = addMinutes(currentTime, slotDuration);

        // Skip past slots (but allow same-day bookings)
        if (isBefore(currentTime, now)) {
            currentTime = slotEnd;
            continue;
        }

        // Check if slot overlaps with any Google Event
        const isConflictGoogle = googleEvents.some((event) => {
            if (!event.start?.dateTime || !event.end?.dateTime) return false;
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            return (
                (currentTime >= eventStart && currentTime < eventEnd) ||
                (slotEnd > eventStart && slotEnd <= eventEnd)
            );
        });

        // Check if slot overlaps with any DB Appointment
        const isConflictDB = dbAppointments.some((appt) => {
            return (
                (currentTime >= appt.startTime && currentTime < appt.endTime) ||
                (slotEnd > appt.startTime && slotEnd <= appt.endTime)
            );
        });

        if (!isConflictGoogle && !isConflictDB) {
            slots.push(format(currentTime, 'HH:mm'));
        }

        currentTime = slotEnd;
    }

    return slots;
}

export async function bookAppointment(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const reason = formData.get('reason') as string;
    const dateStr = formData.get('date') as string; // YYYY-MM-DD
    const timeStr = formData.get('time') as string; // HH:mm

    const startTime = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
    const endTime = addMinutes(startTime, 30);
    const now = new Date();

    // Validation: Max 3 months in advance
    const maxDate = addMonths(now, 3);
    if (startTime > maxDate) {
        return { success: false, error: 'Les réservations sont limitées à 3 mois à l\'avance.' };
    }

    // Validation: Cannot book in the past
    if (startTime < now) {
        return { success: false, error: 'Impossible de réserver un créneau passé.' };
    }

    // Generate cancellation token
    const cancellationToken = crypto.randomBytes(32).toString('hex');

    try {
        // 1. Create Google Calendar Event
        let googleEventId = null;
        try {
            const googleEvent = await createEvent(
                startTime,
                endTime,
                `RDV - ${name}`,
                `Patient: ${name}\nTéléphone: ${phone}\nEmail: ${email}\nMotif: ${reason || 'Non précisé'}`
            );
            googleEventId = googleEvent.id;
        } catch (error) {
            console.warn('Google Calendar error (continuing without):', error);
        }

        // 2. Save to DB
        try {
            await prisma.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientName: name,
                    patientEmail: email,
                    patientPhone: phone,
                    reason,
                    googleEventId,
                    cancellationToken,
                    status: 'CONFIRMED',
                },
            });
        } catch (error) {
            console.warn('DB Save Error:', error);
            return { success: false, error: 'Erreur lors de l\'enregistrement.' };
        }

        // 3. Send confirmation email
        try {
            await sendConfirmationEmail({
                patientName: name,
                patientEmail: email,
                date: startTime,
                time: timeStr,
                reason,
                cancellationToken,
            });
        } catch (error) {
            console.warn('Email error (appointment still created):', error);
        }

        return { success: true };
    } catch (error) {
        console.error('Booking error:', error);
        return { success: false, error: 'Erreur lors de la réservation.' };
    }
}

export async function getAllAppointments() {
    try {
        return await prisma.appointment.findMany({
            orderBy: {
                startTime: 'asc',
            },
        });
    } catch (error) {
        console.warn('DB Error in getAllAppointments:', error);
        return [];
    }
}

export async function cancelAppointment(id: string) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) throw new Error('Appointment not found');

        // 1. Delete from Google Calendar
        if (appointment.googleEventId) {
            try {
                await deleteEvent(appointment.googleEventId);
            } catch (error) {
                console.warn('Google Calendar delete error:', error);
            }
        }

        // 2. Update DB
        await prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        // 3. Send cancellation email
        try {
            await sendCancellationEmail({
                patientName: appointment.patientName,
                patientEmail: appointment.patientEmail,
                date: appointment.startTime,
                time: format(appointment.startTime, 'HH:mm'),
            });
        } catch (error) {
            console.warn('Email error:', error);
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Cancellation error:', error);
        return { success: false, error: 'Erreur lors de l\'annulation.' };
    }
}

// Cancel appointment by token (for patient self-cancellation)
export async function cancelAppointmentByToken(token: string) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { cancellationToken: token },
        });

        if (!appointment) {
            return { success: false, error: 'Rendez-vous non trouvé.' };
        }

        if (appointment.status === 'CANCELLED') {
            return { success: false, error: 'Ce rendez-vous a déjà été annulé.' };
        }

        // Check if appointment is in the past
        if (appointment.startTime < new Date()) {
            return { success: false, error: 'Impossible d\'annuler un rendez-vous passé.' };
        }

        // Check 24h minimum notice for patient self-cancellation
        const hoursUntilAppointment = (appointment.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilAppointment < 24) {
            return {
                success: false,
                error: 'Annulation impossible moins de 24h avant le rendez-vous. Veuillez contacter le cabinet par téléphone.'
            };
        }

        // Delete from Google Calendar
        if (appointment.googleEventId) {
            try {
                await deleteEvent(appointment.googleEventId);
            } catch (error) {
                console.warn('Google Calendar delete error:', error);
            }
        }

        // Update DB
        await prisma.appointment.update({
            where: { cancellationToken: token },
            data: { status: 'CANCELLED' },
        });

        // Send cancellation email
        try {
            await sendCancellationEmail({
                patientName: appointment.patientName,
                patientEmail: appointment.patientEmail,
                date: appointment.startTime,
                time: format(appointment.startTime, 'HH:mm'),
            });
        } catch (error) {
            console.warn('Email error:', error);
        }

        return {
            success: true,
            appointment: {
                patientName: appointment.patientName,
                startTime: appointment.startTime,
            },
        };
    } catch (error) {
        console.error('Cancellation by token error:', error);
        return { success: false, error: 'Erreur lors de l\'annulation.' };
    }
}

// Get appointment by token (for viewing before cancellation)
export async function getAppointmentByToken(token: string) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { cancellationToken: token },
            select: {
                id: true,
                patientName: true,
                patientEmail: true,
                startTime: true,
                endTime: true,
                reason: true,
                status: true,
            },
        });

        return appointment;
    } catch (error) {
        console.error('Get appointment by token error:', error);
        return null;
    }
}
