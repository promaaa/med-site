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

        // Also return env status (without exposing actual keys)
        const env = {
            resendConfigured: !!process.env.RESEND_API_KEY,
            fromEmail: process.env.FROM_EMAIL || "",
        };

        return NextResponse.json({ settings, env });
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
        const {
            googleCalendarId,
            workStartHour,
            workEndHour,
            slotDurationMinutes,
            lunchBreakEnabled,
            lunchBreakStart,
            lunchBreakEnd,
            adminEmail,
            appointmentReasons,
        } = body;

        // Get or create settings
        let settings = await prisma.settings.findFirst();

        const updateData = {
            googleCalendarId: googleCalendarId,
            workStartHour: workStartHour !== undefined ? workStartHour : undefined,
            workEndHour: workEndHour !== undefined ? workEndHour : undefined,
            slotDurationMinutes: slotDurationMinutes !== undefined ? slotDurationMinutes : undefined,
            lunchBreakEnabled: lunchBreakEnabled !== undefined ? lunchBreakEnabled : undefined,
            lunchBreakStart: lunchBreakStart || undefined,
            lunchBreakEnd: lunchBreakEnd || undefined,
            adminEmail: adminEmail !== undefined ? adminEmail : undefined,
            appointmentReasons: appointmentReasons || undefined,
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key as keyof typeof updateData] === undefined) {
                delete updateData[key as keyof typeof updateData];
            }
        });

        if (settings) {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: updateData,
            });
        } else {
            settings = await prisma.settings.create({
                data: {
                    googleCalendarId: googleCalendarId || "primary",
                    workStartHour: workStartHour || 9,
                    workEndHour: workEndHour || 17,
                    slotDurationMinutes: slotDurationMinutes || 30,
                    lunchBreakEnabled: lunchBreakEnabled ?? true,
                    lunchBreakStart: lunchBreakStart || "12:00",
                    lunchBreakEnd: lunchBreakEnd || "14:00",
                    adminEmail: adminEmail || null,
                    appointmentReasons: appointmentReasons || '["Consultation générale","Renouvellement ordonnance","Suivi médical","Vaccination","Certificat médical","Autre"]',
                },
            });
        }

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
