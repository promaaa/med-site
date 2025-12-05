'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function PageHeader() {
    return (
        <header className="w-full px-6 py-8 flex justify-between items-center border-b border-border/40">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                DR. MARTIN
            </Link>
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
    );
}
