'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cancelAppointment } from "@/app/actions";
import { format } from "date-fns";
import { useState } from "react";

type Appointment = {
    id: string;
    startTime: Date;
    endTime: Date;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    reason: string | null;
    status: string;
};

export default function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleCancel = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
        setLoadingId(id);
        await cancelAppointment(id);
        setLoadingId(null);
    };

    return (
        <div className="space-y-4">
            {appointments.length === 0 ? (
                <p className="text-muted-foreground">Aucun rendez-vous trouvé.</p>
            ) : (
                appointments.map((appt) => (
                    <Card key={appt.id} className={appt.status === 'CANCELLED' ? 'opacity-50' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {format(new Date(appt.startTime), "PPP p")} - {format(new Date(appt.endTime), "p")}
                            </CardTitle>
                            <div className={`text-xs font-bold px-2 py-1 border ${appt.status === 'CONFIRMED' ? 'border-primary text-primary' :
                                appt.status === 'CANCELLED' ? 'border-destructive text-destructive' : 'border-muted-foreground text-muted-foreground'
                                }`}>
                                {appt.status}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold">Patient</p>
                                    <p>{appt.patientName}</p>
                                    <p>{appt.patientEmail}</p>
                                    <p>{appt.patientPhone}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Raison</p>
                                    <p>{appt.reason || "N/A"}</p>
                                </div>
                            </div>
                            {appt.status !== 'CANCELLED' && (
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleCancel(appt.id)}
                                        disabled={loadingId === appt.id}
                                    >
                                        {loadingId === appt.id ? "Annulation en cours..." : "Annuler le rendez-vous"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
