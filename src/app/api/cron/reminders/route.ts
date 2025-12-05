import { NextRequest, NextResponse } from 'next/server';
import { sendReminderEmails } from '@/lib/reminders';

// This endpoint should be called daily by a cron job (e.g., Vercel Cron, GitHub Actions)
// Example cron schedule: 0 18 * * * (every day at 6 PM to send reminders for next day)

export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow in development or if secret matches
    if (process.env.NODE_ENV !== 'development' && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await sendReminderEmails();
        return NextResponse.json({
            success: true,
            message: `${result.sent} rappel(s) envoyé(s)`,
            ...result
        });
    } catch (error) {
        console.error('Cron reminder error:', error);
        return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 });
    }
}
