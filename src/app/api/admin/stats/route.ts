import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export async function GET() {
    try {
        const now = new Date();
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        // Get all appointments for current and last month
        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: lastMonthStart,
                    lte: currentMonthEnd,
                },
            },
            orderBy: { startTime: 'asc' },
        });

        // Current month stats
        const currentMonthAppointments = appointments.filter(
            a => a.startTime >= currentMonthStart && a.startTime <= currentMonthEnd
        );
        const currentConfirmed = currentMonthAppointments.filter(a => a.status === 'CONFIRMED').length;
        const currentCancelled = currentMonthAppointments.filter(a => a.status === 'CANCELLED').length;
        const currentTotal = currentMonthAppointments.length;

        // Last month stats
        const lastMonthAppointments = appointments.filter(
            a => a.startTime >= lastMonthStart && a.startTime <= lastMonthEnd
        );
        const lastConfirmed = lastMonthAppointments.filter(a => a.status === 'CONFIRMED').length;
        const lastCancelled = lastMonthAppointments.filter(a => a.status === 'CANCELLED').length;
        const lastTotal = lastMonthAppointments.length;

        // Cancellation rate
        const cancellationRate = currentTotal > 0
            ? Math.round((currentCancelled / currentTotal) * 100)
            : 0;

        // Daily breakdown for current month
        const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
        const dailyData = daysInMonth.map(day => {
            const dayStart = startOfDay(day);
            const dayAppointments = currentMonthAppointments.filter(
                a => startOfDay(a.startTime).getTime() === dayStart.getTime()
            );
            return {
                date: format(day, 'yyyy-MM-dd'),
                label: format(day, 'd', { locale: fr }),
                confirmed: dayAppointments.filter(a => a.status === 'CONFIRMED').length,
                cancelled: dayAppointments.filter(a => a.status === 'CANCELLED').length,
                total: dayAppointments.length,
            };
        });

        // Popular hours
        const hourCounts: Record<number, number> = {};
        currentMonthAppointments
            .filter(a => a.status === 'CONFIRMED')
            .forEach(a => {
                const hour = a.startTime.getHours();
                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            });

        const popularHours = Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Popular reasons
        const reasonCounts: Record<string, number> = {};
        currentMonthAppointments
            .filter(a => a.status === 'CONFIRMED' && a.reason)
            .forEach(a => {
                const reason = a.reason!;
                reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            });

        const popularReasons = Object.entries(reasonCounts)
            .map(([reason, count]) => ({ reason, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Comparison with last month
        const growth = lastConfirmed > 0
            ? Math.round(((currentConfirmed - lastConfirmed) / lastConfirmed) * 100)
            : currentConfirmed > 0 ? 100 : 0;

        return NextResponse.json({
            currentMonth: {
                label: format(now, 'MMMM yyyy', { locale: fr }),
                confirmed: currentConfirmed,
                cancelled: currentCancelled,
                total: currentTotal,
                cancellationRate,
            },
            lastMonth: {
                label: format(subMonths(now, 1), 'MMMM yyyy', { locale: fr }),
                confirmed: lastConfirmed,
                cancelled: lastCancelled,
                total: lastTotal,
            },
            growth,
            dailyData,
            popularHours,
            popularReasons,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
