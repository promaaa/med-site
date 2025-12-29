import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        // For now, just return a message - actual control would need 
        // a separate backend service or WebSocket connection
        if (action === 'start') {
            return NextResponse.json({
                success: true,
                message: 'Pour démarrer l\'assistant, exécutez: python dashboard.py'
            });
        } else if (action === 'stop') {
            return NextResponse.json({
                success: true,
                message: 'Pour arrêter l\'assistant, utilisez Ctrl+C dans le terminal'
            });
        } else {
            return NextResponse.json(
                { error: 'Action invalide' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error controlling assistant:', error);
        return NextResponse.json(
            { error: 'Erreur interne' },
            { status: 500 }
        );
    }
}
