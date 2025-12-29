import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ASSISTANT_DIR = process.env.ASSISTANT_DIR || '/Users/user/Documents/code/pipecat/medical_voice_assistant';
const ENV_FILE = path.join(ASSISTANT_DIR, '.env');

export async function GET() {
    try {
        if (!existsSync(ENV_FILE)) {
            return NextResponse.json({
                configured: false,
                provider: 'ovh',
                sipServer: '',
                sipUsername: '',
                doctorPhone: ''
            });
        }

        const content = await readFile(ENV_FILE, 'utf-8');
        const config: Record<string, string> = {};

        for (const line of content.split('\n')) {
            if (line.includes('=') && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                config[key.trim()] = valueParts.join('=').trim().replace(/^"|"$/g, '');
            }
        }

        return NextResponse.json({
            configured: Boolean(config.SIP_USERNAME && config.SIP_PASSWORD),
            provider: config.SIP_SERVER?.includes('ovh') ? 'ovh' :
                config.SIP_SERVER?.includes('twilio') ? 'twilio' :
                    config.SIP_SERVER?.includes('free') ? 'free' : 'custom',
            sipServer: config.SIP_SERVER || '',
            sipUsername: config.SIP_USERNAME || '',
            doctorPhone: config.DOCTOR_PHONE_NUMBER || ''
        });
    } catch (error) {
        console.error('Error reading config:', error);
        return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Build the .env content
        const envContent = `# Open Medical Secretary - Configuration
# Généré depuis le dashboard med-site

# SIP Trunk Configuration
SIP_SERVER="${data.sipServer || 'siptrunk.ovh.net'}"
SIP_PORT="5060"
SIP_USERNAME="${data.sipUsername || ''}"
SIP_PASSWORD="${data.sipPassword || ''}"

# Doctor Phone (for emergencies)
DOCTOR_PHONE_NUMBER="${data.doctorPhone || ''}"
`;

        await writeFile(ENV_FILE, envContent, 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Configuration sauvegardée'
        });
    } catch (error) {
        console.error('Error saving config:', error);
        return NextResponse.json(
            { error: 'Failed to save config' },
            { status: 500 }
        );
    }
}
