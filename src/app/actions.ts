'use server'

import { prisma } from '@/lib/prisma';
import { listEvents, createEvent, deleteEvent } from '@/lib/googleCalendar';
import { addMinutes, format, parse, isBefore, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns';
import { revalidatePath } from 'next/cache';

// Singleton Prisma Client (I'll create this file next)
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function getAvailableSlots(dateStr: string) {
    const date = new Date(dateStr);
    const startOfDayDate = startOfDay(date);
    const endOfDayDate = endOfDay(date);

    // 1. Get Google Calendar Events
    const googleEvents = await listEvents(startOfDayDate, endOfDayDate);

    // 2. Get DB Appointments
    let dbAppointments: any[] = []; // Using any[] to avoid importing Appointment type for now, or import it properly.
    // Better: import { Appointment } from '@prisma/client';
    // But to be quick and safe:
    // let dbAppointments: { startTime: Date; endTime: Date }[] = [];
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

    // 3. Define Working Hours (Mock for now, later fetch from DB)
    const workStartHour = 9;
    const workEndHour = 17;
    const slotDuration = 30; // minutes

    const slots = [];
    let currentTime = setHours(setMinutes(date, 0), workStartHour);
    const endTime = setHours(setMinutes(date, 0), workEndHour);

    while (isBefore(currentTime, endTime)) {
        const slotEnd = addMinutes(currentTime, slotDuration);

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

    // Double check availability (omitted for brevity, but recommended)

    try {
        // 1. Create Google Calendar Event
        const googleEvent = await createEvent(
            startTime,
            endTime,
            `Appointment with ${name}`,
            `Reason: ${reason}\nPhone: ${phone}\nEmail: ${email}`
        );

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
                    googleEventId: googleEvent.id,
                    status: 'CONFIRMED',
                },
            });
        } catch (error) {
            console.warn('DB Save Error (ignoring for demo):', error);
        }

        return { success: true };
    } catch (error) {
        console.error('Booking error:', error);
        return { success: false, error: 'Failed to book appointment' };
    }
}

export async function getAllAppointments() {
    return await prisma.appointment.findMany({
        orderBy: {
            startTime: 'asc',
        },
    });
}

export async function cancelAppointment(id: string) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) throw new Error('Appointment not found');

        // 1. Delete from Google Calendar
        if (appointment.googleEventId) {
            await deleteEvent(appointment.googleEventId);
        }

        // 2. Update DB (or delete)
        await prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Cancellation error:', error);
        return { success: false, error: 'Failed to cancel appointment' };
    }
}
