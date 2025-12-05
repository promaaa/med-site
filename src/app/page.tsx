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
      <header className="w-full px-4 md:px-6 py-4 md:py-8 flex justify-between items-center border-b border-border/40">
        <div className="text-lg md:text-xl font-bold tracking-tight">
          DR. MARTIN
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">À Propos</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
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
      <section className="flex-1 flex flex-col items-center px-4 md:px-6 py-12 md:py-24 max-w-7xl mx-auto w-full">
        <div className="w-full text-center md:text-left space-y-4 md:space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] animate-slide-up">
            L'ART DE SOIGNER,<br />PRÈS DE CHEZ VOUS.
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Une expérience de soins conçue pour la clarté et le confort.
          </p>
          <div className="flex flex-col gap-4 items-center md:items-start animate-slide-up pt-4" style={{ animationDelay: '0.2s' }}>
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-none text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Prendre Rendez-vous →
              </Button>
            </Link>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground text-center md:text-left">
              <AvailableSlots />
              <span className="opacity-60">13, place Alphonse-Fiquet, Amiens</span>
            </div>
          </div>
        </div>

        {/* Image - Hidden on very small screens */}
        <div className="hidden sm:flex mt-8 md:mt-0 items-center justify-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/main_illustration.png"
            alt="Illustration médicale"
            width={200}
            height={200}
            className="h-auto w-[150px] md:w-[200px] object-contain"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
          <Link href="/services#consultation" className="p-6 md:p-12 hover:bg-secondary/30 transition-all group cursor-pointer">
            <span className="block text-xs font-bold text-muted-foreground mb-2 md:mb-4">01</span>
            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 group-hover:translate-x-2 transition-transform">Consultation</h3>
            <p className="text-sm md:text-base text-muted-foreground">Diagnostic, traitement et suivi.</p>
          </Link>
          <Link href="/services#suivi" className="p-6 md:p-12 hover:bg-secondary/30 transition-all group cursor-pointer">
            <span className="block text-xs font-bold text-muted-foreground mb-2 md:mb-4">02</span>
            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 group-hover:translate-x-2 transition-transform">Suivi Médical</h3>
            <p className="text-sm md:text-base text-muted-foreground">Maladies chroniques et prévention.</p>
          </Link>
          <Link href="/services#teleconsultation" className="p-6 md:p-12 hover:bg-secondary/30 transition-colors group cursor-pointer">
            <span className="block text-xs font-bold text-muted-foreground mb-2 md:mb-4">03</span>
            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 group-hover:translate-x-2 transition-transform">Téléconsultation</h3>
            <p className="text-sm md:text-base text-muted-foreground">Consultez par vidéo.</p>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-16 text-center md:text-left">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pourquoi nous choisir</span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mt-2 md:mt-4">
              L'EXCELLENCE AU SERVICE DE VOTRE SANTÉ
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 md:p-6 border border-border/40">
              <div className="text-2xl md:text-4xl font-bold text-primary">20+</div>
              <h4 className="text-sm md:text-base font-bold">Années d'expérience</h4>
            </div>
            <div className="space-y-2 p-4 md:p-6 border border-border/40">
              <div className="text-2xl md:text-4xl font-bold text-primary">15min</div>
              <h4 className="text-sm md:text-base font-bold">Temps d'attente</h4>
            </div>
            <div className="space-y-2 p-4 md:p-6 border border-border/40">
              <div className="text-2xl md:text-4xl font-bold text-primary">98%</div>
              <h4 className="text-sm md:text-base font-bold">Patients satisfaits</h4>
            </div>
            <div className="space-y-2 p-4 md:p-6 border border-border/40">
              <div className="text-2xl md:text-4xl font-bold text-primary">24/7</div>
              <h4 className="text-sm md:text-base font-bold">Télémédecine</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter">
            PRÊT À PRENDRE SOIN<br />DE VOTRE SANTÉ ?
          </h2>
          <p className="text-sm md:text-lg opacity-80 max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto rounded-none text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
                Prendre Rendez-vous
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-none text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
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
