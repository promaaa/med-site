import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
        <Link href="/book">
          <Button variant="outline" className="rounded-none border-primary hover:bg-primary hover:text-primary-foreground transition-all">
            Prendre Rendez-vous
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center px-6 py-20 md:py-32 max-w-7xl mx-auto w-full gap-12">
        <div className="flex-1 space-y-6 max-w-4xl">
                                              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05]">
                                              L'ART<br />DE SOIGNER,<br />PRÈS DE CHEZ VOUS.
                                            </h1>          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Une expérience de soins de santé conçue pour la clarté et le confort.
            Temps d'attente minimaux, attention maximale.
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-6 items-start">
            <Link href="/book">
              <Button size="lg" className="rounded-none text-lg px-8 py-6 h-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Commencer &rarr;
              </Button>
            </Link>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2 md:mt-0">
              <span>Disponible aujourd'hui: 14:00, 15:30, 16:45</span>
              <span className="opacity-60">13 place Alphone Fiquet, Amiens</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <Image
            src="/main_illustration.png"
            alt="main illustration"
            width="250"
            height="250"
            className="h-auto w-[250px] object-contain opacity-100"
          />
        </div>
      </section>

      {/* Services Grid (Minimal) */}
      <section className="border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
          <div className="p-12 hover:bg-secondary/30 transition-colors group">
            <span className="block text-xs font-bold text-muted-foreground mb-4">01</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Médecine Générale</h3>
            <p className="text-muted-foreground">Soins complets pour vos besoins de santé quotidiens.</p>
          </div>
          <div className="p-12 hover:bg-secondary/30 transition-colors group">
            <span className="block text-xs font-bold text-muted-foreground mb-4">02</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Soins Spécialisés</h3>
            <p className="text-muted-foreground">Attention experte pour les conditions médicales complexes.</p>
          </div>
          <div className="p-12 hover:bg-secondary/30 transition-colors group">
            <span className="block text-xs font-bold text-muted-foreground mb-4">03</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform">Télémédecine</h3>
            <p className="text-muted-foreground">Consultez des médecins depuis le confort de votre domicile.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">CLINIQUE DU DR. MARTIN</h4>
            <p className="text-muted-foreground text-sm">
              © 2025 Tous droits réservés.<br />
              Conçu pour les patients.
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">Besoin d'aide ?</p>
            <a href="tel:+1234567890" className="text-muted-foreground hover:text-foreground transition-colors">
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
