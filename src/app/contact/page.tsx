import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Contact | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Contactez le cabinet du Dr. Martin à Amiens. Téléphone, email, formulaire de contact et informations pratiques pour nous rejoindre.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Hero Section */}
            <section className="px-6 py-20 md:py-32 border-b border-border/40">
                <div className="max-w-7xl mx-auto">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-4 mb-6">
                        PARLONS<br />ENSEMBLE
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Une question, un besoin d'information ? N'hésitez pas à nous contacter.
                        Nous vous répondrons dans les plus brefs délais.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-8 tracking-tight">ENVOYEZ-NOUS UN MESSAGE</h2>
                        <ContactForm />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">INFORMATIONS</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 border border-border flex items-center justify-center text-xl">
                                        📍
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Adresse</h4>
                                        <p className="text-muted-foreground">
                                            13 place Alphonse Fiquet<br />
                                            80000 Amiens, France
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 border border-border flex items-center justify-center text-xl">
                                        📞
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Téléphone</h4>
                                        <a href="tel:+33322123456" className="text-muted-foreground hover:text-foreground transition-colors">
                                            +33 3 22 12 34 56
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 border border-border flex items-center justify-center text-xl">
                                        📧
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Email</h4>
                                        <a href="mailto:contact@dr-martin.fr" className="text-muted-foreground hover:text-foreground transition-colors">
                                            contact@dr-martin.fr
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div>
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">HORAIRES</h2>
                            <div className="border border-border/40 divide-y divide-border/40">
                                <div className="flex justify-between p-4">
                                    <span>Lundi - Vendredi</span>
                                    <span className="font-bold">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span>Samedi</span>
                                    <span className="font-bold">09:00 - 12:00</span>
                                </div>
                                <div className="flex justify-between p-4 text-muted-foreground">
                                    <span>Dimanche</span>
                                    <span>Fermé</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                * Télémédecine disponible 7j/7 sur rendez-vous
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-4">
                            <Link href="/book" className="w-full">
                                <Button className="w-full rounded-none h-14 text-lg">
                                    Prendre Rendez-vous en Ligne
                                </Button>
                            </Link>
                            <a href="tel:+33322123456" className="w-full">
                                <Button variant="outline" className="w-full rounded-none h-14 text-lg">
                                    Appeler le Cabinet
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="border-t border-border/40">
                <div className="h-[400px] bg-secondary/30 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🗺️</div>
                        <p className="text-muted-foreground">
                            13 place Alphonse Fiquet, 80000 Amiens
                        </p>
                        <a
                            href="https://maps.google.com/?q=13+place+Alphonse+Fiquet+Amiens"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4"
                        >
                            <Button variant="outline" size="sm" className="rounded-none">
                                Ouvrir dans Google Maps
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
