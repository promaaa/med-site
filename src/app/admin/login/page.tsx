"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/admin");
            }
        } catch (error) {
            setError("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="w-full px-6 py-8 border-b border-border/40">
                <Link href="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                    DR. MARTIN
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tighter mb-2">CONNEXION ADMIN</h1>
                        <p className="text-muted-foreground">Accédez à votre panneau d'administration</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 border border-red-500 bg-red-500/10 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="rounded-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Mot de passe
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="rounded-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none h-12 text-base"
                        >
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
