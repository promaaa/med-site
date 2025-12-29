import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function checkService(url: string, timeout: number = 2000): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch {
        return false;
    }
}

async function checkPort(port: number, timeout: number = 2000): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Try to connect via HTTP
        const response = await fetch(`http://localhost:${port}`, {
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);
        return true;
    } catch {
        // Connection refused means server is not running, but if we get other errors
        // the port might still be open
        return false;
    }
}

export async function GET() {
    try {
        const services: Record<string, boolean> = {};

        // Check Ollama (has API endpoint)
        services['ollama_llm'] = await checkService('http://localhost:11434/api/tags');

        // Check TTS (has health endpoint)
        services['coqui_tts'] = await checkService('http://localhost:5555/health');

        // Check Assistant - try the TTS synthesize endpoint as proxy
        // If TTS works and Ollama works, assistant is likely running
        services['assistant_ia'] = services['ollama_llm'] && services['coqui_tts'];

        // Asterisk - we can't easily check from browser, assume configured
        services['asterisk_pbx'] = false; // Will show as "not running" by default

        // Calculate running status
        const running = services['ollama_llm'] && services['coqui_tts'];

        return NextResponse.json({
            services,
            running,
            stats: {
                calls: 0,
                transcriptions: 0,
                responses: 0,
                errors: 0
            },
            logs: running ? [
                { timestamp: new Date().toLocaleTimeString('fr-FR'), level: 'OK', message: 'Services actifs' }
            ] : [
                { timestamp: new Date().toLocaleTimeString('fr-FR'), level: 'WARN', message: 'En attente des services...' }
            ]
        });
    } catch (error) {
        console.error('Error checking assistant status:', error);
        return NextResponse.json({
            services: {
                ollama_llm: false,
                coqui_tts: false,
                assistant_ia: false,
                asterisk_pbx: false
            },
            running: false,
            stats: { calls: 0, transcriptions: 0, responses: 0, errors: 0 },
            logs: [
                { timestamp: new Date().toLocaleTimeString('fr-FR'), level: 'ERROR', message: 'Erreur de vérification' }
            ]
        });
    }
}
