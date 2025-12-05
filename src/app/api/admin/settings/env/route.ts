import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

// Store API keys in a separate secure file that the app reads on restart
// In production, use a secrets manager instead

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { resendApiKey, fromEmail } = body;

        // Read existing .env.local if it exists
        const envPath = join(process.cwd(), '.env.local');
        let envContent = '';

        try {
            envContent = await readFile(envPath, 'utf-8');
        } catch {
            // File doesn't exist, that's fine
        }

        // Parse existing env vars
        const envVars: Record<string, string> = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
            }
        });

        // Update with new values
        if (resendApiKey && resendApiKey !== "••••••••••") {
            envVars['RESEND_API_KEY'] = resendApiKey;
            // Also update in process.env for immediate effect (limited to this process)
            process.env.RESEND_API_KEY = resendApiKey;
        }

        if (fromEmail !== undefined) {
            envVars['FROM_EMAIL'] = fromEmail;
            process.env.FROM_EMAIL = fromEmail;
        }

        // Write back to .env.local
        const newEnvContent = Object.entries(envVars)
            .map(([key, value]) => `${key}="${value}"`)
            .join('\n');

        await writeFile(envPath, newEnvContent + '\n', 'utf-8');

        return NextResponse.json({
            success: true,
            message: "Configuration enregistrée. Redémarrez le serveur pour appliquer les changements API."
        });
    } catch (error) {
        console.error("Error updating env:", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}
