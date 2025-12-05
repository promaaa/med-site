import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope, Activity, Video } from "lucide-react";

export const metadata: Metadata = {
    title: "Services | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Consultations, suivi médical et téléconsultations au cabinet du Dr. Martin à Amiens.",
};

const services = [
    {
        icon: Stethoscope,
        title: "Consultation",
        description: "Diagnostic, traitement et suivi de vos problèmes de santé.",
        features: ["Diagnostic", "Ordonnances", "Certificats"],
    },
    {
        icon: Activity,
        title: "Suivi Médical",
        description: "Accompagnement pour maladies chroniques et prévention.",
        features: ["Maladies chroniques", "Bilans", "Prévention"],
    },
    {
        icon: Video,
        title: "Téléconsultation",
        description: "Consultez par vidéo depuis chez vous.",
        features: ["Vidéo", "Ordonnance en ligne", "Horaires flexibles"],
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Main Content */}
            <section className="flex-1 px-4 md:px-6 py-10 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 md:mb-4">
                            NOS SERVICES
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Des soins de qualité pour toute la famille
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="border border-border/40 p-4 md:p-6 hover:border-primary/60 transition-all"
                            >
                                <service.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mb-3 md:mb-4" />
                                <h3 className="text-lg md:text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                                    {service.description}
                                </p>
                                <ul className="space-y-1">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="text-xs md:text-sm flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Info & Price */}
                    <div className="border border-border/40 p-4 md:p-6 mb-6 md:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                            <div>
                                <p className="font-bold text-sm md:text-base">Conventionné Secteur 1</p>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    Remboursé par la Sécurité sociale
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-2xl md:text-3xl font-bold text-primary">25€</p>
                                <p className="text-xs md:text-sm text-muted-foreground">par consultation</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link href="/book" className="block sm:inline-block">
                            <Button className="w-full sm:w-auto rounded-none h-12 px-8">
                                Prendre Rendez-vous
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
