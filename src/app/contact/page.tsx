import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Contactez le cabinet du Dr. Martin à Amiens. Téléphone, email et informations pratiques.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Main Content */}
            <section className="flex-1 px-4 md:px-6 py-10 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 md:mb-4">
                            CONTACTEZ-NOUS
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Prenez rendez-vous ou contactez-nous directement.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
                        <Link href="/book">
                            <Button className="w-full h-12 md:h-14 text-base md:text-lg rounded-none">
                                Prendre Rendez-vous
                            </Button>
                        </Link>
                        <a href="tel:+33322123456">
                            <Button variant="outline" className="w-full h-12 md:h-14 text-base md:text-lg rounded-none">
                                <Phone className="w-5 h-5 mr-2" />
                                Appeler
                            </Button>
                        </a>
                    </div>

                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        {/* Address */}
                        <div className="border border-border/40 p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Adresse</h3>
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground">
                                13, place Alphonse-Fiquet<br />
                                80000 Amiens
                            </p>
                        </div>

                        {/* Hours */}
                        <div className="border border-border/40 p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Horaires</h3>
                            </div>
                            <div className="space-y-1 md:space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Lun - Ven</span>
                                    <span className="font-medium">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Samedi</span>
                                    <span className="font-medium">09:00 - 12:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Dimanche</span>
                                    <span className="text-muted-foreground">Fermé</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="border border-border/40 overflow-hidden mb-6 md:mb-8">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2570.5!2d2.2967!3d49.8942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e7847d4e5c6b4b%3A0x48c7e9a8d5f9e8a7!2s13%20Place%20Alphonse-Fiquet%2C%2080000%20Amiens!5e0!3m2!1sfr!2sfr!4v1701785600000!5m2!1sfr!2sfr"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localisation du cabinet"
                            className="w-full"
                        />
                    </div>

                    {/* Contact Info Row */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 text-center border-t border-border/40 pt-6 md:pt-8">
                        <a href="tel:+33322123456" className="flex items-center justify-center gap-2 text-sm hover:text-primary transition-colors py-2">
                            <Phone className="w-4 h-4" />
                            <span>+33 3 22 12 34 56</span>
                        </a>
                        <a href="mailto:contact@dr-martin.fr" className="flex items-center justify-center gap-2 text-sm hover:text-primary transition-colors py-2">
                            <Mail className="w-4 h-4" />
                            <span>contact@dr-martin.fr</span>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
