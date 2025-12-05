'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LayoutDashboard, Calendar, BarChart3, Clock, Settings, LogOut, ExternalLink, Menu, X } from "lucide-react";

const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { href: "/admin/calendar", label: "Calendrier", icon: Calendar },
    { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
    { href: "/admin/availability", label: "Disponibilités", icon: Clock },
    { href: "/admin/settings", label: "Configuration", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <aside className="w-64 bg-gray-900 text-white hidden md:flex md:flex-col">
                <div className="p-6 border-b border-gray-700">
                    <Link href="/" className="block">
                        <h2 className="text-xl font-bold text-white">DR. MARTIN</h2>
                        <p className="text-xs text-gray-400 mt-1">Panneau d'administration</p>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href, item.exact)
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700 space-y-1">
                    <Link href="/">
                        <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                            <ExternalLink className="w-5 h-5" />
                            <span>Voir le site</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
                <div className="flex items-center justify-between p-4">
                    <Link href="/admin">
                        <h2 className="text-lg font-bold">DR. MARTIN</h2>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2"
                    >
                        <span className="block w-5 h-0.5 bg-white mb-1"></span>
                        <span className="block w-5 h-0.5 bg-white mb-1"></span>
                        <span className="block w-5 h-0.5 bg-white"></span>
                    </button>
                </div>
                {mobileMenuOpen && (
                    <nav className="p-4 border-t border-gray-700 space-y-1 bg-gray-900">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${isActive(item.href, item.exact)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-gray-700 mt-2 space-y-1">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                <div className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg">
                                    <ExternalLink className="w-5 h-5" />
                                    <span>Voir le site</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </nav>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto mt-16 md:mt-0 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
