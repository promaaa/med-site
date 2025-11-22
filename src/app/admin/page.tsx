import { getAllAppointments } from "@/app/actions";
import AppointmentsList from "@/components/AppointmentsList";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const appointments = await getAllAppointments();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Rendez-vous</h1>
            <AppointmentsList appointments={appointments} />
        </div>
    );
}
