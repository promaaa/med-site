import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: {
                startTime: 'asc',
            },
        });

        return NextResponse.json({ appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json({ appointments: [] });
    }
}
