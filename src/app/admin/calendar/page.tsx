'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addMonths, subMonths, eachWeekOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Appointment = {
    id: string;
    startTime: string;
    endTime: string;
    patientName: string;
    patientEmail: string;
    status: string;
    reason: string | null;
};

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'week' | 'month'>('week');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/appointments')
            .then(res => res.json())
            .then(data => {
                setAppointments(data.appointments || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const navigatePrev = () => {
        if (view === 'week') {
            setCurrentDate(subWeeks(currentDate, 1));
        } else {
            setCurrentDate(subMonths(currentDate, 1));
        }
    };

    const navigateNext = () => {
        if (view === 'week') {
            setCurrentDate(addWeeks(currentDate, 1));
        } else {
            setCurrentDate(addMonths(currentDate, 1));
        }
    };

    const goToToday = () => setCurrentDate(new Date());

    const getAppointmentsForDay = (date: Date) => {
        return appointments.filter(apt => {
            const aptDate = new Date(apt.startTime);
            return isSameDay(aptDate, date) && apt.status !== 'CANCELLED';
        });
    };

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

    const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8h to 17h

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendrier</h1>
                    <p className="text-gray-600">
                        {view === 'week'
                            ? `Semaine du ${format(weekStart, 'd MMM', { locale: fr })} au ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`
                            : format(currentDate, 'MMMM yyyy', { locale: fr })}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={goToToday} className="text-sm">
                        Aujourd'hui
                    </Button>
                    <div className="flex border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setView('week')}
                            className={`px-4 py-2 text-sm ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Semaine
                        </button>
                        <button
                            onClick={() => setView('month')}
                            className={`px-4 py-2 text-sm ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Mois
                        </button>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={navigatePrev}>←</Button>
                        <Button variant="outline" size="sm" onClick={navigateNext}>→</Button>
                    </div>
                </div>
            </div>

            {/* Week View */}
            {view === 'week' && (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-8 border-b">
                        <div className="p-3 text-center text-xs font-medium text-gray-500 border-r"></div>
                        {weekDays.map(day => {
                            const isToday = isSameDay(day, new Date());
                            const dayAppointments = getAppointmentsForDay(day);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`p-3 text-center border-r last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="text-xs font-medium text-gray-500 uppercase">
                                        {format(day, 'EEE', { locale: fr })}
                                    </div>
                                    <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {format(day, 'd')}
                                    </div>
                                    {dayAppointments.length > 0 && (
                                        <div className="text-xs text-blue-600 font-medium">
                                            {dayAppointments.length} RDV
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Time Grid */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {hours.map(hour => (
                            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                                <div className="p-2 text-xs text-gray-500 text-right border-r">
                                    {hour}:00
                                </div>
                                {weekDays.map(day => {
                                    const dayAppointments = getAppointmentsForDay(day).filter(apt => {
                                        const aptHour = new Date(apt.startTime).getHours();
                                        return aptHour === hour;
                                    });
                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className="p-1 min-h-[60px] border-r last:border-r-0 hover:bg-gray-50"
                                        >
                                            {dayAppointments.map(apt => (
                                                <Link
                                                    key={apt.id}
                                                    href={`/admin`}
                                                    className="block p-2 mb-1 bg-blue-100 border-l-4 border-blue-600 text-xs rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    <div className="font-medium text-blue-900 truncate">
                                                        {apt.patientName}
                                                    </div>
                                                    <div className="text-blue-700">
                                                        {format(new Date(apt.startTime), 'HH:mm')}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Month View */}
            {view === 'month' && (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-7 border-b">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                            <div key={day} className="p-3 text-center text-xs font-medium text-gray-500 uppercase border-r last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    {monthWeeks.map(weekStart => {
                        const days = eachDayOfInterval({
                            start: weekStart,
                            end: endOfWeek(weekStart, { weekStartsOn: 1 })
                        });

                        return (
                            <div key={weekStart.toISOString()} className="grid grid-cols-7 border-b last:border-b-0">
                                {days.map(day => {
                                    const isToday = isSameDay(day, new Date());
                                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                    const dayAppointments = getAppointmentsForDay(day);

                                    return (
                                        <div
                                            key={day.toISOString()}
                                            className={`min-h-[100px] p-2 border-r last:border-r-0 ${!isCurrentMonth ? 'bg-gray-50' : ''} ${isToday ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {format(day, 'd')}
                                            </div>
                                            <div className="space-y-1">
                                                {dayAppointments.slice(0, 3).map(apt => (
                                                    <div
                                                        key={apt.id}
                                                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                                                    >
                                                        {format(new Date(apt.startTime), 'HH:mm')} {apt.patientName.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayAppointments.length > 3 && (
                                                    <div className="text-xs text-blue-600 font-medium">
                                                        +{dayAppointments.length - 3} autres
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 border-l-4 border-blue-600 rounded"></div>
                    <span>Rendez-vous confirmé</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-50 rounded"></div>
                    <span>Aujourd'hui</span>
                </div>
            </div>
        </div>
    );
}
