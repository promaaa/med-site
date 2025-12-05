import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        const whereClause: any = {};

        if (startDate && endDate) {
            whereClause.startTime = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            orderBy: {
                startTime: 'asc',
            },
        });

        // Generate CSV content
        const headers = ['Date', 'Heure', 'Patient', 'Email', 'Téléphone', 'Motif', 'Statut'];
        const rows = appointments.map(apt => [
            format(new Date(apt.startTime), 'dd/MM/yyyy', { locale: fr }),
            format(new Date(apt.startTime), 'HH:mm'),
            apt.patientName,
            apt.patientEmail,
            apt.patientPhone,
            apt.reason || '',
            apt.status === 'CONFIRMED' ? 'Confirmé' : apt.status === 'CANCELLED' ? 'Annulé' : 'En attente',
        ]);

        const csvContent = [
            headers.join(';'),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
        ].join('\n');

        // Add BOM for Excel UTF-8 compatibility
        const bom = '\uFEFF';

        return new NextResponse(bom + csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="rendez-vous-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'export' }, { status: 500 });
    }
}
