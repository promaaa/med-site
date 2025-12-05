import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const settings = await prisma.settings.findFirst();

        return NextResponse.json({ settings });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { googleCalendarId, workStartHour, workEndHour, slotDurationMinutes } = body;

        // Get or create settings
        let settings = await prisma.settings.findFirst();

        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    googleCalendarId: googleCalendarId || settings.googleCalendarId,
                    workStartHour: workStartHour !== undefined ? workStartHour : settings.workStartHour,
                    workEndHour: workEndHour !== undefined ? workEndHour : settings.workEndHour,
                    slotDurationMinutes: slotDurationMinutes !== undefined ? slotDurationMinutes : settings.slotDurationMinutes,
                },
            });
        } else {
            settings = await prisma.settings.create({
                data: {
                    googleCalendarId: googleCalendarId || "primary",
                    workStartHour: workStartHour || 9,
                    workEndHour: workEndHour || 17,
                    slotDurationMinutes: slotDurationMinutes || 30,
                },
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
