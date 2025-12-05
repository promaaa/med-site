import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCalendarClient } from "@/lib/googleCalendar";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Test Google Calendar connection
        const { client: calendar, calendarId } = await getCalendarClient();

        // Try to list events for the next 7 days
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const response = await calendar.events.list({
            calendarId,
            timeMin: now.toISOString(),
            timeMax: nextWeek.toISOString(),
            singleEvents: true,
            maxResults: 10,
        });

        const eventCount = response.data.items?.length || 0;

        return NextResponse.json({
            success: true,
            message: `Connexion réussie ! ${eventCount} événement(s) trouvé(s) cette semaine.`,
            calendarId,
            eventCount,
        });
    } catch (error: any) {
        console.error("Calendar test error:", error);

        // Provide helpful error messages
        let errorMessage = error.message || "Erreur de connexion au calendrier";

        if (error.message?.includes("Missing Google Calendar credentials")) {
            errorMessage = "Aucun identifiant Google Calendar configuré. Uploadez d'abord le fichier JSON.";
        } else if (error.message?.includes("invalid_grant") || error.message?.includes("Invalid JWT")) {
            errorMessage = "Les identifiants sont invalides ou expirés. Vérifiez votre fichier JSON.";
        } else if (error.message?.includes("Not Found") || error.message?.includes("notFound")) {
            errorMessage = "Calendrier non trouvé. Vérifiez que le calendrier est partagé avec le compte de service.";
        } else if (error.message?.includes("Calendar API has not been used")) {
            errorMessage = "L'API Google Calendar n'est pas activée. Activez-la dans Google Cloud Console.";
        } else if (error.message?.includes("accessNotConfigured")) {
            errorMessage = "L'API Calendar n'est pas configurée pour ce projet. Activez-la dans Google Cloud Console.";
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
        }, { status: 400 });
    }
}
