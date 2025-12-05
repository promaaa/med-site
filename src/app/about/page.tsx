import { Metadata } from 'next';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "À Propos | Dr. Martin - Médecin Généraliste à Amiens",
    description: "Découvrez le Dr. Martin et son équipe. Plus de 20 ans d'expérience en médecine générale au service des patients d'Amiens et ses environs.",
};

const timeline = [
    {
        year: "2003",
        title: "Diplôme de Médecine",
        description: "Obtention du diplôme de docteur en médecine à l'Université de Paris.",
    },
    {
        year: "2005",
        title: "Spécialisation",
        description: "Formation complémentaire en médecine générale et soins de premier recours.",
    },
    {
        year: "2008",
        title: "Installation à Amiens",
        description: "Ouverture du cabinet médical au cœur d'Amiens.",
    },
    {
        year: "2015",
        title: "Télémédecine",
        description: "Pionnier de la téléconsultation dans la région des Hauts-de-France.",
    },
    {
        year: "2020",
        title: "Modernisation",
        description: "Rénovation complète du cabinet avec équipements de dernière génération.",
    },
];

const values = [
    {
        title: "Écoute",
        description: "Chaque patient est unique. Nous prenons le temps de comprendre vos besoins et préoccupations.",
        icon: "👂",
    },
    {
        title: "Excellence",
        description: "Des soins de qualité supérieure grâce à une formation continue et des équipements modernes.",
        icon: "⭐",
    },
    {
        title: "Accessibilité",
        description: "Des horaires flexibles et la télémédecine pour vous accompagner selon vos contraintes.",
        icon: "🚀",
    },
    {
        title: "Confiance",
        description: "Une relation patient-médecin basée sur la transparence et le respect mutuel.",
        icon: "🤝",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PageHeader />

            {/* Hero Section */}
            <section className="px-6 py-20 md:py-32 border-b border-border/40">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">À Propos</span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mt-4 mb-6">
                            DR. MARTIN
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            Passionné par la médecine depuis toujours, je consacre ma carrière
                            à offrir des soins de qualité dans un environnement accueillant et moderne.
                            Mon approche combine expertise médicale et attention personnalisée pour
                            chaque patient.
                        </p>
                        <div className="flex flex-wrap gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-primary">20+</div>
                                <div className="text-sm text-muted-foreground">Années d'expérience</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary">5000+</div>
                                <div className="text-sm text-muted-foreground">Patients suivis</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary">98%</div>
                                <div className="text-sm text-muted-foreground">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-secondary/30 border border-border/40 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="text-8xl mb-4">👨‍⚕️</div>
                                <p className="text-lg font-bold">Dr. Martin</p>
                                <p className="text-muted-foreground text-sm">Médecin Généraliste</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-secondary/10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nos Valeurs</span>
                        <h2 className="text-4xl font-bold tracking-tighter mt-4">
                            CE QUI NOUS GUIDE
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16 text-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notre Histoire</span>
                        <h2 className="text-4xl font-bold tracking-tighter mt-4">
                            PARCOURS
                        </h2>
                    </div>
                    <div className="space-y-0">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-8 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-2 border-primary flex items-center justify-center text-sm font-bold bg-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {item.year.slice(2)}
                                    </div>
                                    {index < timeline.length - 1 && (
                                        <div className="w-px h-full bg-border min-h-[60px]" />
                                    )}
                                </div>
                                <div className="pb-12">
                                    <span className="text-xs text-muted-foreground">{item.year}</span>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Credentials Section */}
            <section className="py-20 px-6 border-t border-border/40">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Qualifications</span>
                        <h2 className="text-4xl font-bold tracking-tighter mt-4">
                            FORMATIONS & DIPLÔMES
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-border/40 p-6 hover:border-primary/40 transition-colors">
                            <h4 className="font-bold mb-2">Doctorat en Médecine</h4>
                            <p className="text-sm text-muted-foreground">Université de Paris - 2003</p>
                        </div>
                        <div className="border border-border/40 p-6 hover:border-primary/40 transition-colors">
                            <h4 className="font-bold mb-2">DES Médecine Générale</h4>
                            <p className="text-sm text-muted-foreground">CHU Amiens-Picardie - 2005</p>
                        </div>
                        <div className="border border-border/40 p-6 hover:border-primary/40 transition-colors">
                            <h4 className="font-bold mb-2">Formation Télémédecine</h4>
                            <p className="text-sm text-muted-foreground">Ordre des Médecins - 2015</p>
                        </div>
                        <div className="border border-border/40 p-6 hover:border-primary/40 transition-colors">
                            <h4 className="font-bold mb-2">Membre du Conseil de l'Ordre</h4>
                            <p className="text-sm text-muted-foreground">Hauts-de-France</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-6 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Prêt à nous rencontrer ?
                    </h2>
                    <p className="opacity-80">
                        Prenez rendez-vous dès maintenant et découvrez notre approche personnalisée des soins médicaux.
                    </p>
                    <Link href="/book">
                        <Button variant="secondary" className="rounded-none">
                            Prendre Rendez-vous
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
