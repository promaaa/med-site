import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
    title: "À Propos | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Découvrez le Dr. Martin. Plus de 20 ans d'expérience en médecine générale à Amiens.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Main Content */}
            <section className="flex-1 px-4 md:px-6 py-10 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 md:mb-4">
                            DR. MARTIN
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Médecin Généraliste à Amiens
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-12 text-center">
                        <div className="border border-border/40 p-3 md:p-6">
                            <div className="text-xl md:text-3xl font-bold text-primary">20+</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Années</div>
                        </div>
                        <div className="border border-border/40 p-3 md:p-6">
                            <div className="text-xl md:text-3xl font-bold text-primary">5000+</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Patients</div>
                        </div>
                        <div className="border border-border/40 p-3 md:p-6">
                            <div className="text-xl md:text-3xl font-bold text-primary">98%</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Satisfaction</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-center mb-8 md:mb-12">
                        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Passionné par la médecine, je consacre ma carrière à offrir des soins de qualité
                            dans un environnement accueillant. Mon approche combine expertise médicale et
                            attention personnalisée.
                        </p>
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
