import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Path to the medical_voice_assistant directory
const ASSISTANT_DIR = process.env.ASSISTANT_DIR || '/Users/user/Documents/code/pipecat/medical_voice_assistant';

export async function POST(request: NextRequest) {
    try {
        const { action } = await request.json();

        if (action === 'start') {
            // Start the dashboard in background
            try {
                await execAsync(
                    `cd ${ASSISTANT_DIR} && source venv/bin/activate && python dashboard.py &`,
                    { shell: '/bin/zsh' }
                );
                return NextResponse.json({ success: true, message: 'Assistant starting...' });
            } catch (error) {
                return NextResponse.json(
                    { success: false, error: 'Failed to start assistant' },
                    { status: 500 }
                );
            }
        } else if (action === 'stop') {
            // Stop all related processes
            try {
                await execAsync('pkill -f "python.*main.py" || true');
                await execAsync('pkill -f "python.*coqui_server" || true');
                await execAsync('pkill -f "python.*dashboard" || true');
                return NextResponse.json({ success: true, message: 'Assistant stopped' });
            } catch (error) {
                return NextResponse.json(
                    { success: false, error: 'Failed to stop assistant' },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error controlling assistant:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
