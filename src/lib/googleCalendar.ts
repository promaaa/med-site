import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const getCalendarClient = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return google.calendar({ version: 'v3', auth });
};

const isMock = !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.includes('your-service-account');

export const listEvents = async (timeMin: Date, timeMax: Date) => {
  if (isMock) {
    console.warn('Mocking listEvents: No credentials');
    return [];
  }
  const calendar = getCalendarClient();
  try {
    const response = await calendar.events.list({
      calendarId: 'primary', // Or specific calendar ID if needed
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  } catch (error) {
    console.error('Error listing calendar events:', error);
    throw error;
  }
};

export const createEvent = async (
  startTime: Date,
  endTime: Date,
  summary: string,
  description: string
) => {
  if (isMock) {
    console.warn('Mocking createEvent: No credentials');
    return { id: 'mock-event-id-' + Date.now() };
  }
  const calendar = getCalendarClient();
  const event = {
    summary,
    description,
    start: {
      dateTime: startTime.toISOString(),
    },
    end: {
      dateTime: endTime.toISOString(),
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  if (isMock) {
    console.warn('Mocking deleteEvent: No credentials');
    return;
  }
  const calendar = getCalendarClient();
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};
