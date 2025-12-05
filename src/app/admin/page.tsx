import { getAllAppointments } from "@/app/actions";
import AppointmentsList from "@/components/AppointmentsList";
import Link from "next/link";
import { format, startOfDay, endOfDay, isToday, isTomorrow, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const appointments = await getAllAppointments();

    // Calculate statistics
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const todayAppointments = appointments.filter(
        a => a.status !== 'CANCELLED' &&
            new Date(a.startTime) >= todayStart &&
            new Date(a.startTime) <= todayEnd
    );

    const upcomingAppointments = appointments.filter(
        a => a.status !== 'CANCELLED' &&
            isAfter(new Date(a.startTime), now)
    );

    const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
    const cancelledCount = appointments.filter(a => a.status === 'CANCELLED').length;

    // Next appointment
    const nextAppointment = upcomingAppointments[0];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">
                        {format(now, "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/calendar"
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        🗓️ Calendrier
                    </Link>
                    <a
                        href="/api/admin/export"
                        download
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        📥 Exporter CSV
                    </a>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                    <p className="text-xs text-gray-500 mt-1">rendez-vous</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500">À venir</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{upcomingAppointments.length}</p>
                    <p className="text-xs text-gray-500 mt-1">rendez-vous planifiés</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500">Confirmés</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{confirmedCount}</p>
                    <p className="text-xs text-gray-500 mt-1">au total</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-medium text-gray-500">Annulés</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{cancelledCount}</p>
                    <p className="text-xs text-gray-500 mt-1">au total</p>
                </div>
            </div>

            {/* Next Appointment */}
            {nextAppointment && (
                <div className="bg-blue-600 text-white rounded-lg shadow-sm p-6">
                    <p className="text-sm font-medium text-blue-100">Prochain rendez-vous</p>
                    <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-2xl font-bold">
                                {format(new Date(nextAppointment.startTime), "HH:mm")} - {nextAppointment.patientName}
                            </p>
                            <p className="text-blue-100">
                                {isToday(new Date(nextAppointment.startTime))
                                    ? "Aujourd'hui"
                                    : isTomorrow(new Date(nextAppointment.startTime))
                                        ? "Demain"
                                        : format(new Date(nextAppointment.startTime), "EEEE d MMMM", { locale: fr })}
                                {nextAppointment.reason && ` • ${nextAppointment.reason}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`tel:${nextAppointment.patientPhone}`}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                📞 Appeler
                            </a>
                            <a
                                href={`mailto:${nextAppointment.patientEmail}`}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                ✉️ Email
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Today's Appointments */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Rendez-vous du jour</h2>
                    <Link href="/book" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        + Nouveau rendez-vous
                    </Link>
                </div>
                {todayAppointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                        Aucun rendez-vous prévu aujourd'hui
                    </div>
                ) : (
                    <div className="space-y-2">
                        {todayAppointments.map((appt) => (
                            <div key={appt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-lg font-bold text-gray-900">
                                        {format(new Date(appt.startTime), "HH:mm")}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{appt.patientName}</p>
                                        <p className="text-sm text-gray-500">{appt.reason || "Consultation"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a href={`tel:${appt.patientPhone}`} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                                        📞
                                    </a>
                                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                        CONFIRMÉ
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* All Appointments */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tous les rendez-vous</h2>
                <AppointmentsList appointments={appointments} />
            </div>
        </div>
    );
}
