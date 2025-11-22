'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAvailableSlots, bookAppointment } from '@/app/actions';
import { format } from 'date-fns';

export default function BookingFlow() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (date) {
            setLoadingSlots(true);
            setSlots([]);
            setSelectedSlot(null);
            getAvailableSlots(format(date, 'yyyy-MM-dd'))
                .then((fetchedSlots) => {
                    setSlots(fetchedSlots);
                })
                .catch((err) => console.error(err))
                .finally(() => setLoadingSlots(false));
        }
    }, [date]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!date || !selectedSlot) return;

        setBookingStatus('loading');
        const formData = new FormData(e.currentTarget);
        formData.append('date', format(date, 'yyyy-MM-dd'));
        formData.append('time', selectedSlot);

        const result = await bookAppointment(formData);
        if (result.success) {
            setBookingStatus('success');
        } else {
            setBookingStatus('error');
        }
    };

    if (bookingStatus === 'success') {
        return (
            <div className="text-center p-12 border border-border/40 bg-secondary/10">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">RENDEZ-VOUS CONFIRMÉ.</h2>
                <p className="text-muted-foreground mb-8">Vous recevrez un e-mail de confirmation sous peu.</p>
                <Button onClick={() => window.location.reload()} className="rounded-none" variant="outline">
                    Réserver un autre
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight border-b border-border/40 pb-2">01. SÉLECTIONNER LA DATE</h3>
                <div className="border border-border/40 p-4 inline-block">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-none"
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight border-b border-border/40 pb-2">02. SÉLECTIONNER L'HEURE</h3>
                {loadingSlots ? (
                    <p className="text-muted-foreground animate-pulse">Chargement des disponibilités...</p>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                        {slots.map((slot) => (
                            <Button
                                key={slot}
                                variant={selectedSlot === slot ? 'default' : 'outline'}
                                onClick={() => setSelectedSlot(slot)}
                                className={`w-full rounded-none ${selectedSlot === slot ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                            >
                                {slot}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Aucun créneau disponible pour cette date.</p>
                )}

                {selectedSlot && (
                    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 space-y-6">
                        <h3 className="text-xl font-bold tracking-tight border-b border-border/40 pb-2">03. VOS COORDONNÉES</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Nom complet</Label>
                                <Input id="name" name="name" required placeholder="JEAN DUPONT" className="rounded-none border-border/60 focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                                <Input id="email" name="email" type="email" required placeholder="JEAN@EXAMPLE.COM" className="rounded-none border-border/60 focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">Téléphone</Label>
                                <Input id="phone" name="phone" type="tel" required placeholder="+1 234 567 890" className="rounded-none border-border/60 focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason" className="text-xs uppercase tracking-wider text-muted-foreground">Raison de la visite</Label>
                                <Input id="reason" name="reason" placeholder="CONTRÔLE, CONSULTATION..." className="rounded-none border-border/60 focus:border-primary" />
                            </div>
                            <Button type="submit" className="w-full rounded-none h-12 text-lg" disabled={bookingStatus === 'loading'}>
                                {bookingStatus === 'loading' ? 'TRAITEMENT EN COURS...' : 'CONFIRMER LE RENDEZ-VOUS'}
                            </Button>
                            {bookingStatus === 'error' && (
                                <p className="text-destructive text-sm font-medium">La réservation a échoué. Veuillez réessayer.</p>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
