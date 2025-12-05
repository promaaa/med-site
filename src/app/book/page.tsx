"use client";

import BookingFlow from "@/components/BookingFlow";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

export default function BookPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="max-w-5xl w-full space-y-12">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Réservation</span>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">PRENDRE RENDEZ-VOUS</h1>
                        <p className="text-muted-foreground text-lg">Sélectionnez l'heure qui vous convient.</p>
                    </div>
                    <div className="w-full">
                        <BookingFlow />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
