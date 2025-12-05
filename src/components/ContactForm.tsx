'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you'd send this to an API endpoint
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="text-center p-8 border border-border/40 bg-secondary/10">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2">MESSAGE ENVOYÉ</h3>
                <p className="text-muted-foreground mb-4">
                    Nous vous répondrons dans les plus brefs délais.
                </p>
                <Button
                    variant="outline"
                    className="rounded-none"
                    onClick={() => setStatus('idle')}
                >
                    Envoyer un autre message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Nom complet
                    </Label>
                    <Input
                        id="contact-name"
                        name="name"
                        required
                        placeholder="Jean Dupont"
                        className="rounded-none border-border/60 focus:border-primary"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                        E-mail
                    </Label>
                    <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="jean@example.com"
                        className="rounded-none border-border/60 focus:border-primary"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Téléphone
                </Label>
                <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    className="rounded-none border-border/60 focus:border-primary"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Sujet
                </Label>
                <Input
                    id="contact-subject"
                    name="subject"
                    required
                    placeholder="Question sur les services"
                    className="rounded-none border-border/60 focus:border-primary"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Message
                </Label>
                <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Votre message..."
                    className="w-full px-3 py-2 border border-border/60 bg-transparent focus:border-primary focus:outline-none resize-none"
                />
            </div>
            <Button
                type="submit"
                className="w-full rounded-none h-12 text-lg"
                disabled={status === 'loading'}
            >
                {status === 'loading' ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE'}
            </Button>
            {status === 'error' && (
                <p className="text-destructive text-sm font-medium text-center">
                    Une erreur s'est produite. Veuillez réessayer.
                </p>
            )}
        </form>
    );
}
