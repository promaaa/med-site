'use client';

import { useEffect, useState } from 'react';
import { getAvailableSlots } from '@/app/actions';
import { format } from 'date-fns';

export default function AvailableSlots() {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        getAvailableSlots(today)
            .then((fetchedSlots) => {
                // Show only first 3 slots for the hero section
                setSlots(fetchedSlots.slice(0, 3));
            })
            .catch(() => {
                // Fallback slots if API fails
                setSlots(['09:00', '10:30', '14:00']);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <span className="animate-pulse">Chargement des créneaux...</span>
        );
    }

    if (slots.length === 0) {
        return <span>Aucun créneau disponible aujourd'hui</span>;
    }

    return (
        <span>Disponible aujourd'hui: {slots.join(', ')}</span>
    );
}
