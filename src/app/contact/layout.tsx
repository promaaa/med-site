import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact | Dr. Martin - Médecin Généraliste Amiens',
    description: 'Contactez le cabinet du Dr. Martin à Amiens. Adresse : 13 place Alphonse Fiquet, 80000 Amiens. Horaires et informations pratiques.',
    openGraph: {
        title: 'Contact | Dr. Martin',
        description: 'Coordonnées et horaires du cabinet médical Dr. Martin à Amiens.',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
