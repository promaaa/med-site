import { addDays, getYear, isWithinInterval, startOfDay } from 'date-fns';

// Calculate Easter Sunday using the Anonymous Gregorian algorithm
function getEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

// Get all French public holidays for a given year
export function getFrenchHolidays(year: number): Date[] {
    const easter = getEasterSunday(year);

    return [
        // Fixed holidays
        new Date(year, 0, 1),   // Jour de l'An - 1er janvier
        new Date(year, 4, 1),   // Fête du Travail - 1er mai
        new Date(year, 4, 8),   // Victoire 1945 - 8 mai
        new Date(year, 6, 14),  // Fête Nationale - 14 juillet
        new Date(year, 7, 15),  // Assomption - 15 août
        new Date(year, 10, 1),  // Toussaint - 1er novembre
        new Date(year, 10, 11), // Armistice - 11 novembre
        new Date(year, 11, 25), // Noël - 25 décembre

        // Mobile holidays (based on Easter)
        addDays(easter, 1),     // Lundi de Pâques
        addDays(easter, 39),    // Ascension
        addDays(easter, 50),    // Lundi de Pentecôte
    ];
}

// Check if a date is a French public holiday
export function isFrenchHoliday(date: Date): boolean {
    const year = getYear(date);
    const holidays = getFrenchHolidays(year);
    const dateStart = startOfDay(date);

    return holidays.some(holiday =>
        startOfDay(holiday).getTime() === dateStart.getTime()
    );
}

// Get holiday name for a date (optional, for display)
export function getHolidayName(date: Date): string | null {
    const year = getYear(date);
    const easter = getEasterSunday(year);
    const dateStart = startOfDay(date);

    const holidayNames: { date: Date; name: string }[] = [
        { date: new Date(year, 0, 1), name: "Jour de l'An" },
        { date: new Date(year, 4, 1), name: "Fête du Travail" },
        { date: new Date(year, 4, 8), name: "Victoire 1945" },
        { date: new Date(year, 6, 14), name: "Fête Nationale" },
        { date: new Date(year, 7, 15), name: "Assomption" },
        { date: new Date(year, 10, 1), name: "Toussaint" },
        { date: new Date(year, 10, 11), name: "Armistice" },
        { date: new Date(year, 11, 25), name: "Noël" },
        { date: addDays(easter, 1), name: "Lundi de Pâques" },
        { date: addDays(easter, 39), name: "Ascension" },
        { date: addDays(easter, 50), name: "Lundi de Pentecôte" },
    ];

    const holiday = holidayNames.find(h =>
        startOfDay(h.date).getTime() === dateStart.getTime()
    );

    return holiday?.name || null;
}
