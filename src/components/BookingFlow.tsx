'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAvailableSlots, bookAppointment } from '@/app/actions';
import { format, addMonths } from 'date-fns';
import { isFrenchHoliday, getHolidayName } from '@/lib/holidays';

// Predefined appointment reasons
const APPOINTMENT_REASONS = [
    "Consultation générale",
    "Renouvellement ordonnance",
    "Suivi médical",
    "Vaccination",
    "Certificat médical",
    "Autre",
];

export default function BookingFlow() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Max date: 3 months from now
    const maxDate = addMonths(new Date(), 3);

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
        setErrorMessage('');
        const formData = new FormData(e.currentTarget);
        formData.append('date', format(date, 'yyyy-MM-dd'));
        formData.append('time', selectedSlot);

        const result = await bookAppointment(formData);
        if (result.success) {
            setBookingStatus('success');
            router.push('/book/confirmation');
        } else {
            setBookingStatus('error');
            setErrorMessage(result.error || 'Erreur lors de la réservation');
        }
    };

    if (bookingStatus === 'success') {
        return (
            <div className="text-center p-8 md:p-12 border border-border/40 bg-secondary/10">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4 text-sm md:text-base">Redirection...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Step 1: Date */}
            <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold tracking-tight border-b border-border/40 pb-2">
                    1. CHOISIR LA DATE
                </h3>
                <div className="border border-border/40 p-2 md:p-4 overflow-x-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-none mx-auto"
                        disabled={(date) => {
                            const today = new Date(new Date().setHours(0, 0, 0, 0));
                            const day = date.getDay();
                            return date < today || date > maxDate || day === 0 || day === 6 || isFrenchHoliday(date);
                        }}
                    />
                </div>
                <p className="text-xs text-muted-foreground text-center md:text-left">
                    Réservations jusqu'à 3 mois à l'avance (hors weekends et jours fériés).
                </p>
            </div>

            {/* Step 2: Time */}
            <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold tracking-tight border-b border-border/40 pb-2">
                    2. CHOISIR L'HEURE
                </h3>
                {loadingSlots ? (
                    <p className="text-muted-foreground animate-pulse text-sm">Chargement...</p>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                            <Button
                                key={slot}
                                variant={selectedSlot === slot ? 'default' : 'outline'}
                                onClick={() => setSelectedSlot(slot)}
                                className={`rounded-none text-sm py-3 ${selectedSlot === slot ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                            >
                                {slot}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">Aucun créneau disponible.</p>
                )}
            </div>

            {/* Step 3: Contact Info */}
            {selectedSlot && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight border-b border-border/40 pb-2">
                        3. VOS COORDONNÉES
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Nom complet
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Jean Dupont"
                                className="rounded-none border-border/60 focus:border-primary h-12 text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                                E-mail
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="jean@example.com"
                                className="rounded-none border-border/60 focus:border-primary h-12 text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Téléphone
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                placeholder="06 12 34 56 78"
                                className="rounded-none border-border/60 focus:border-primary h-12 text-base"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-xs uppercase tracking-wider text-muted-foreground">
                                Motif de la visite
                            </Label>
                            <select
                                id="reason"
                                name="reason"
                                required
                                className="w-full h-12 px-3 border border-border/60 bg-background text-foreground rounded-none focus:border-primary focus:outline-none text-base"
                            >
                                <option value="">Sélectionnez un motif</option>
                                {APPOINTMENT_REASONS.map(reason => (
                                    <option key={reason} value={reason}>{reason}</option>
                                ))}
                            </select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full rounded-none h-14 text-base md:text-lg font-bold"
                            disabled={bookingStatus === 'loading'}
                        >
                            {bookingStatus === 'loading' ? 'TRAITEMENT...' : 'CONFIRMER'}
                        </Button>
                        {bookingStatus === 'error' && (
                            <p className="text-destructive text-sm font-medium text-center">{errorMessage}</p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
