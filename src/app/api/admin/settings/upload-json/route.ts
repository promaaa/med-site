import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { clearCredentialsCache } from "@/lib/googleCalendar";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();

        // Validate JSON structure
        if (!body.client_email || !body.private_key) {
            return NextResponse.json(
                { error: "Fichier JSON invalide : client_email et private_key sont requis" },
                { status: 400 }
            );
        }

        // Validate that it looks like a service account
        if (!body.client_email.includes('@') || !body.client_email.includes('.iam.gserviceaccount.com')) {
            return NextResponse.json(
                { error: "Ce n'est pas un fichier de compte de service Google valide" },
                { status: 400 }
            );
        }

        if (!body.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
            return NextResponse.json(
                { error: "La clé privée n'est pas valide" },
                { status: 400 }
            );
        }

        // Get or create settings
        let settings = await prisma.settings.findFirst();

        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    googleServiceAccountEmail: body.client_email,
                    googlePrivateKey: body.private_key,
                },
            });
        } else {
            settings = await prisma.settings.create({
                data: {
                    googleServiceAccountEmail: body.client_email,
                    googlePrivateKey: body.private_key,
                    googleCalendarId: "primary",
                    workStartHour: 9,
                    workEndHour: 17,
                    slotDurationMinutes: 30,
                },
            });
        }

        // Clear the credentials cache so new credentials are used immediately
        clearCredentialsCache();

        return NextResponse.json({
            success: true,
            message: "Configuration Google Calendar mise à jour",
            email: body.client_email,
            projectId: body.project_id || "N/A",
        });
    } catch (error: any) {
        console.error("Error uploading JSON:", error);
        return NextResponse.json(
            { error: error.message || "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
