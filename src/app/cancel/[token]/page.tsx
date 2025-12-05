'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAppointmentByToken, cancelAppointmentByToken } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type Appointment = {
    id: string;
    patientName: string;
    patientEmail: string;
    startTime: Date;
    endTime: Date;
    reason: string | null;
    status: string;
};

export default function CancelAppointmentPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadAppointment() {
            const apt = await getAppointmentByToken(token);
            setAppointment(apt as Appointment | null);
            setLoading(false);
        }
        loadAppointment();
    }, [token]);

    const handleCancel = async () => {
        setCancelling(true);
        setError('');

        const result = await cancelAppointmentByToken(token);

        if (result.success) {
            setCancelled(true);
        } else {
            setError(result.error || 'Erreur lors de l\'annulation');
        }

        setCancelling(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Rendez-vous non trouvé</h1>
                    <p className="text-gray-600 mb-6">
                        Ce lien d'annulation n'est pas valide ou le rendez-vous n'existe plus.
                    </p>
                    <Link href="/">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (appointment.status === 'CANCELLED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Déjà annulé</h1>
                    <p className="text-gray-600 mb-6">
                        Ce rendez-vous a déjà été annulé.
                    </p>
                    <Link href="/book">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Reprendre un rendez-vous
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (cancelled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Rendez-vous annulé</h1>
                    <p className="text-gray-600 mb-6">
                        Votre rendez-vous a bien été annulé. Un email de confirmation vous a été envoyé.
                    </p>
                    <Link href="/book">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Reprendre un rendez-vous
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const appointmentDate = new Date(appointment.startTime);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Annuler votre rendez-vous</h1>
                    <p className="text-gray-600 mt-2">
                        Êtes-vous sûr de vouloir annuler ce rendez-vous ?
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Patient</span>
                            <span className="font-medium text-gray-900">{appointment.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium text-gray-900">
                                {format(appointmentDate, "EEEE d MMMM yyyy", { locale: fr })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Heure</span>
                            <span className="font-medium text-gray-900">
                                {format(appointmentDate, "HH:mm")}
                            </span>
                        </div>
                        {appointment.reason && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Motif</span>
                                <span className="font-medium text-gray-900">{appointment.reason}</span>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <Link href="/" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700"
                            disabled={cancelling}
                        >
                            Retour
                        </Button>
                    </Link>
                    <Button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        {cancelling ? 'Annulation...' : 'Confirmer l\'annulation'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
