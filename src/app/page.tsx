'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import AvailableSlots from "@/components/AvailableSlots";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="w-full px-6 py-8 flex justify-between items-center border-b border-border/40">
        <div className="text-xl font-bold tracking-tight">
          DR. MARTIN
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">À Propos</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/book" className="hidden md:block">
            <Button variant="outline" className="rounded-none border-primary hover:bg-primary hover:text-primary-foreground transition-all">
              Prendre Rendez-vous
            </Button>
          </Link>
          <MobileNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center px-6 py-20 md:py-32 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1 space-y-6 max-w-4xl animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] animate-slide-up">
            L'ART<br />DE SOIGNER,<br />PRÈS DE CHEZ VOUS.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Une expérience de soins de santé conçue pour la clarté et le confort.
            Temps d'attente minimaux, attention maximale.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-6 items-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/book">
              <Button size="lg" className="rounded-none text-lg px-8 py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90 btn-press hover-lift">
                Commencer &rarr;
              </Button>
            </Link>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2 md:mt-0">
              <AvailableSlots />
              <span className="opacity-60">13 place Alphonse Fiquet, Amiens</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-end animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/main_illustration.png"
            alt="Illustration médicale"
            width={250}
            height={250}
            className="h-auto w-[250px] object-contain opacity-100 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Services Grid (Minimal) */}
      <section className="border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40 stagger-children">
          <Link href="/services#consultation" className="p-12 hover:bg-secondary/30 transition-all group cursor-pointer card-hover">
            <span className="block text-xs font-bold text-muted-foreground mb-4">01</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Consultation</h3>
            <p className="text-muted-foreground">Diagnostic, traitement et suivi de vos problèmes de santé.</p>
          </Link>
          <Link href="/services#suivi" className="p-12 hover:bg-secondary/30 transition-all group cursor-pointer card-hover">
            <span className="block text-xs font-bold text-muted-foreground mb-4">02</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Suivi Médical</h3>
            <p className="text-muted-foreground">Accompagnement pour maladies chroniques et prévention.</p>
          </Link>
          <Link href="/services#teleconsultation" className="p-12 hover:bg-secondary/30 transition-colors group cursor-pointer">
            <span className="block text-xs font-bold text-muted-foreground mb-4">03</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Téléconsultation</h3>
            <p className="text-muted-foreground">Consultez depuis chez vous par vidéo.</p>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pourquoi nous choisir</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mt-4">
              L'EXCELLENCE<br />AU SERVICE DE VOTRE SANTÉ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 p-6 border border-border/40 hover:border-primary/40 transition-colors">
              <div className="text-4xl font-bold text-primary">20+</div>
              <h4 className="font-bold">Années d'expérience</h4>
              <p className="text-sm text-muted-foreground">Une expertise médicale éprouvée au fil des années.</p>
            </div>
            <div className="space-y-4 p-6 border border-border/40 hover:border-primary/40 transition-colors">
              <div className="text-4xl font-bold text-primary">15min</div>
              <h4 className="font-bold">Temps d'attente moyen</h4>
              <p className="text-sm text-muted-foreground">Votre temps est précieux, nous le respectons.</p>
            </div>
            <div className="space-y-4 p-6 border border-border/40 hover:border-primary/40 transition-colors">
              <div className="text-4xl font-bold text-primary">98%</div>
              <h4 className="font-bold">Patients satisfaits</h4>
              <p className="text-sm text-muted-foreground">La qualité de nos soins reconnue par nos patients.</p>
            </div>
            <div className="space-y-4 p-6 border border-border/40 hover:border-primary/40 transition-colors">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <h4 className="font-bold">Télémédecine</h4>
              <p className="text-sm text-muted-foreground">Consultations à distance selon vos disponibilités.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
            PRÊT À PRENDRE SOIN<br />DE VOTRE SANTÉ ?
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics. Notre équipe vous accueillera avec professionnalisme et bienveillance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" variant="secondary" className="rounded-none text-lg px-8 py-6 h-auto">
                Prendre Rendez-vous
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-none text-lg px-8 py-6 h-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
