import { google } from 'googleapis';
import { prisma } from './prisma';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Cache for credentials to avoid DB calls on every request
let cachedCredentials: {
  client_email: string;
  private_key: string;
  calendar_id: string;
} | null = null;

let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minute cache

// Get credentials from database or environment
async function getCredentials() {
  const now = Date.now();

  // Return cached if fresh
  if (cachedCredentials && (now - lastFetch) < CACHE_TTL) {
    return cachedCredentials;
  }

  // Try to get from database first
  try {
    const settings = await prisma.settings.findFirst();

    if (settings?.googleServiceAccountEmail && settings?.googlePrivateKey) {
      cachedCredentials = {
        client_email: settings.googleServiceAccountEmail,
        private_key: settings.googlePrivateKey.replace(/\\n/g, '\n'),
        calendar_id: settings.googleCalendarId || 'primary',
      };
      lastFetch = now;
      return cachedCredentials;
    }
  } catch (error) {
    console.warn('Could not fetch settings from DB, falling back to env vars');
  }

  // Fallback to environment variables
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    cachedCredentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      calendar_id: process.env.GOOGLE_CALENDAR_ID || 'primary',
    };
    lastFetch = now;
    return cachedCredentials;
  }

  return null;
}

// Check if we're in mock mode
async function isMockMode() {
  const creds = await getCredentials();
  return !creds || !creds.client_email || creds.client_email.includes('your-service-account');
}

export const getCalendarClient = async () => {
  const credentials = await getCredentials();

  if (!credentials?.client_email || !credentials?.private_key) {
    throw new Error('Missing Google Calendar credentials. Please configure in admin settings.');
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return {
    client: google.calendar({ version: 'v3', auth }),
    calendarId: credentials.calendar_id,
  };
};

export const listEvents = async (timeMin: Date, timeMax: Date) => {
  if (await isMockMode()) {
    console.warn('⚠️  Google Calendar en mode MOCK - Configurez vos identifiants');
    return [];
  }

  const { client: calendar, calendarId } = await getCalendarClient();

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    console.log(`✅ ${response.data.items?.length || 0} événements trouvés`);
    return response.data.items || [];
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération des événements:', error.message);
    throw error;
  }
};

export const createEvent = async (
  startTime: Date,
  endTime: Date,
  summary: string,
  description: string
) => {
  if (await isMockMode()) {
    console.warn('⚠️  Google Calendar en mode MOCK - Événement non créé réellement');
    return { id: 'mock-event-id-' + Date.now() };
  }

  const { client: calendar, calendarId } = await getCalendarClient();

  const event = {
    summary,
    description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'Europe/Paris',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all',
    });
    console.log(`✅ Événement créé: ${summary}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Erreur lors de la création de l\'événement:', error.message);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  if (await isMockMode()) {
    console.warn('⚠️  Google Calendar en mode MOCK - Événement non supprimé');
    return;
  }

  const { client: calendar, calendarId } = await getCalendarClient();

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all',
    });
    console.log(`✅ Événement supprimé: ${eventId}`);
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    throw error;
  }
};

// Function to clear the cache (called after settings update)
export const clearCredentialsCache = () => {
  cachedCredentials = null;
  lastFetch = 0;
};
