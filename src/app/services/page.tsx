import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Services | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Consultations de médecine générale, suivi médical et téléconsultations au cabinet du Dr. Martin à Amiens.",
};

const services = [
    {
        id: "consultation",
        number: "01",
        title: "Consultation",
        description: "Consultation de médecine générale pour le diagnostic, le traitement et le suivi de vos problèmes de santé courants.",
        features: [
            "Diagnostic et traitement",
            "Renouvellement d'ordonnances",
            "Certificats médicaux",
            "Arrêts de travail",
        ],
        price: "25€",
    },
    {
        id: "suivi",
        number: "02",
        title: "Suivi Médical",
        description: "Accompagnement régulier pour les maladies chroniques et la prévention santé.",
        features: [
            "Maladies chroniques",
            "Bilans de santé",
            "Suivi de traitement",
            "Conseils de prévention",
        ],
        price: "25€",
    },
    {
        id: "teleconsultation",
        number: "03",
        title: "Téléconsultation",
        description: "Consultez depuis chez vous par vidéo pour vos besoins médicaux ne nécessitant pas d'examen physique.",
        features: [
            "Consultation vidéo",
            "Ordonnance électronique",
            "Horaires flexibles",
            "Depuis votre domicile",
        ],
        price: "25€",
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Hero Section */}
            <section className="px-6 py-20 md:py-32 border-b border-border/40">
                <div className="max-w-7xl mx-auto">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nos Services</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-4 mb-6">
                        MÉDECINE<br />GÉNÉRALE
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Des soins de qualité pour toute la famille. Consultation classique,
                        suivi médical personnalisé ou téléconsultation selon vos besoins.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                id={service.id}
                                className="border border-border/40 p-8 hover:border-primary/60 transition-all group"
                            >
                                <span className="text-xs font-bold text-muted-foreground">{service.number}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-4 group-hover:translate-x-1 transition-transform">
                                    {service.title}
                                </h3>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                                    {service.description}
                                </p>
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, index) => (
                                        <li key={index} className="text-sm flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-center pt-4 border-t border-border/40">
                                    <span className="text-2xl font-bold">{service.price}</span>
                                    <Link href="/book">
                                        <Button variant="outline" size="sm" className="rounded-none">
                                            Réserver
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 px-6 bg-secondary/30 border-t border-b border-border/40">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Informations pratiques</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold mb-2">Conventionné Secteur 1</h4>
                            <p className="text-sm text-muted-foreground">
                                Le cabinet est conventionné secteur 1. Les consultations sont remboursées
                                par la Sécurité sociale selon les tarifs en vigueur.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">Carte Vitale</h4>
                            <p className="text-sm text-muted-foreground">
                                Pensez à apporter votre carte Vitale à jour ainsi que votre
                                attestation de mutuelle si vous en possédez une.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
