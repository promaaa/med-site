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

        const slots = await prisma.availabilitySlot.findMany({
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        });

        return NextResponse.json({ slots });
    } catch (error) {
        console.error("Error fetching availability:", error);
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
        const { morning, afternoon, blockedDates } = body;

        // Delete existing slots
        await prisma.availabilitySlot.deleteMany({});

        // Create new slots from morning schedule
        const slotsToCreate = [];

        for (const [day, schedule] of Object.entries(morning)) {
            const daySchedule = schedule as { enabled: boolean; startTime: string; endTime: string };
            if (daySchedule.enabled) {
                slotsToCreate.push({
                    dayOfWeek: parseInt(day),
                    startTime: daySchedule.startTime,
                    endTime: daySchedule.endTime,
                });
            }
        }

        for (const [day, schedule] of Object.entries(afternoon)) {
            const daySchedule = schedule as { enabled: boolean; startTime: string; endTime: string };
            if (daySchedule.enabled) {
                slotsToCreate.push({
                    dayOfWeek: parseInt(day),
                    startTime: daySchedule.startTime,
                    endTime: daySchedule.endTime,
                });
            }
        }

        if (slotsToCreate.length > 0) {
            await prisma.availabilitySlot.createMany({
                data: slotsToCreate,
            });
        }

        // Handle blocked dates - store in Settings as JSON string
        let settings = await prisma.settings.findFirst();
        if (settings) {
            await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    // Store blockedDates in a custom field or we can extend the schema
                },
            });
        }

        return NextResponse.json({ success: true, slotsCreated: slotsToCreate.length });
    } catch (error) {
        console.error("Error saving availability:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
