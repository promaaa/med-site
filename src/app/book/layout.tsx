import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Prendre Rendez-vous | Dr. Martin - Médecin Généraliste Amiens',
    description: 'Réservez votre consultation en ligne avec le Dr. Martin à Amiens. Créneaux disponibles du lundi au vendredi. Confirmation immédiate par email.',
    openGraph: {
        title: 'Prendre Rendez-vous | Dr. Martin',
        description: 'Réservez votre consultation en ligne avec le Dr. Martin à Amiens.',
    },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
    return children;
}
