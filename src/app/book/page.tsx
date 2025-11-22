"use client";
import BookingFlow from "@/components/BookingFlow";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookPage() {
    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="w-full px-6 py-8 flex justify-between items-center border-b border-border/40">
                <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
                    DR. MARTIN
                </Link>
                <Link href="/">
                    <Button variant="ghost" className="rounded-none hover:bg-transparent hover:underline">
                        &larr; Retour à l'accueil
                    </Button>
                </Link>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="max-w-5xl w-full space-y-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">RÉSERVATION.</h1>
                        <p className="text-muted-foreground text-lg">Sélectionnez l'heure qui vous convient.</p>
                    </div>
                    <div className="w-full">
                        <BookingFlow />
                    </div>
                </div>
            </div>
        </main>
    );
}
