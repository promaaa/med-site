'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                aria-label="Toggle menu"
            >
                <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <nav className="flex flex-col items-center justify-center h-full gap-8">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/services"
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        À Propos
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-bold tracking-tight hover:text-primary transition-colors"
                    >
                        Contact
                    </Link>
                    <Link href="/book" onClick={() => setIsOpen(false)}>
                        <Button size="lg" className="rounded-none text-lg px-8 py-6 h-auto mt-4">
                            Prendre Rendez-vous
                        </Button>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
