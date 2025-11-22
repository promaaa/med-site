import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-64 bg-white border-r p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8 text-blue-600">Panneau d'administration</h2>
                <nav className="space-y-4">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start">
                            Rendez-vous
                        </Button>
                    </Link>
                    <Link href="/admin/availability">
                        <Button variant="ghost" className="w-full justify-start">
                            Disponibilité
                        </Button>
                    </Link>
                    <Link href="/api/auth/signout">
                        <Button variant="ghost" className="w-full justify-start text-red-500">
                            Déconnexion
                        </Button>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
