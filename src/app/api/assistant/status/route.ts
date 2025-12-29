import { NextResponse } from 'next/server';

// Open Medical Secretary API endpoint
const ASSISTANT_API = process.env.ASSISTANT_API_URL || 'http://localhost:9002';

export async function GET() {
    try {
        // Check each service
        const services: Record<string, boolean> = {};

        // Check Ollama
        try {
            const ollamaRes = await fetch('http://localhost:11434/api/tags', {
                signal: AbortSignal.timeout(2000)
            });
            services['ollama_llm'] = ollamaRes.ok;
        } catch {
            services['ollama_llm'] = false;
        }

        // Check TTS
        try {
            const ttsRes = await fetch('http://localhost:5555/health', {
                signal: AbortSignal.timeout(2000)
            });
            services['coqui_tts'] = ttsRes.ok;
        } catch {
            services['coqui_tts'] = false;
        }

        // Check AudioSocket (main assistant)
        try {
            const net = await import('net');
            services['assistant_ia'] = await new Promise((resolve) => {
                const socket = new net.Socket();
                socket.setTimeout(2000);
                socket.on('connect', () => {
                    socket.destroy();
                    resolve(true);
                });
                socket.on('error', () => resolve(false));
                socket.on('timeout', () => {
                    socket.destroy();
                    resolve(false);
                });
                socket.connect(9001, 'localhost');
            });
        } catch {
            services['assistant_ia'] = false;
        }

        // Check Asterisk via Docker
        try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            const { stdout } = await execAsync('docker ps --filter name=open-med-asterisk --format "{{.Names}}"');
            services['asterisk_pbx'] = stdout.includes('open-med-asterisk');
        } catch {
            services['asterisk_pbx'] = false;
        }

        // Calculate running status
        const running = services['ollama_llm'] && services['coqui_tts'] && services['assistant_ia'];

        return NextResponse.json({
            services,
            running,
            stats: {
                calls: 0,
                transcriptions: 0,
                responses: 0,
                errors: 0
            },
            logs: [
                { timestamp: new Date().toLocaleTimeString('fr-FR'), level: 'INFO', message: 'Vérification des services...' }
            ]
        });
    } catch (error) {
        console.error('Error checking assistant status:', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
