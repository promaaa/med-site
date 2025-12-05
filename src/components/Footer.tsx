import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border/40 py-8 md:py-12 px-4 md:px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-12">
                    {/* Brand */}
                    <div className="sm:col-span-2">
                        <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4">DR. MARTIN</h4>
                        <p className="text-muted-foreground text-sm max-w-md">
                            Des soins médicaux de qualité dans un environnement accueillant.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider mb-3 md:mb-4 text-muted-foreground">
                            Navigation
                        </h5>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-sm hover:text-primary transition-colors">
                                Accueil
                            </Link>
                            <Link href="/services" className="text-sm hover:text-primary transition-colors">
                                Services
                            </Link>
                            <Link href="/about" className="text-sm hover:text-primary transition-colors">
                                À Propos
                            </Link>
                            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                                Contact
                            </Link>
                            <Link href="/book" className="text-sm hover:text-primary transition-colors">
                                Rendez-vous
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider mb-3 md:mb-4 text-muted-foreground">
                            Contact
                        </h5>
                        <div className="flex flex-col gap-2 text-sm">
                            <a href="tel:+33322123456" className="hover:text-primary transition-colors">
                                +33 3 22 12 34 56
                            </a>
                            <a href="mailto:contact@dr-martin.fr" className="hover:text-primary transition-colors">
                                contact@dr-martin.fr
                            </a>
                            <p className="text-muted-foreground">
                                13, place Alphonse-Fiquet<br />
                                80000 Amiens
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-6 md:pt-8 border-t border-border/40 gap-4">
                    <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
                        © 2025 Dr. Martin. Tous droits réservés.
                    </p>
                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Mentions Légales
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
