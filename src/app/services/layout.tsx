import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nos Services | Dr. Martin - Médecin Généraliste Amiens',
    description: 'Découvrez nos services médicaux : consultations générales, suivi des maladies chroniques, vaccination, examens de routine et téléconsultation.',
    openGraph: {
        title: 'Nos Services | Dr. Martin',
        description: 'Consultations, suivi médical, vaccination et téléconsultation à Amiens.',
    },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
