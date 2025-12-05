import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Mail, ClipboardList, MapPin } from 'lucide-react';

export default function ConfirmationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Rendez-vous confirmé !</h1>
                    <p className="text-gray-600 mt-2">
                        Votre rendez-vous a bien été enregistré.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email de confirmation
                    </h2>
                    <p className="text-blue-800 text-sm">
                        Un email de confirmation vous a été envoyé avec les détails de votre rendez-vous
                        et un lien pour annuler si nécessaire.
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        À ne pas oublier
                    </h2>
                    <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• Carte Vitale</li>
                        <li>• Carte de mutuelle</li>
                        <li>• Ordonnances en cours (si applicable)</li>
                        <li>• Résultats d'analyses récents (si applicable)</li>
                    </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Adresse du cabinet
                    </h2>
                    <p className="text-gray-600 text-sm">
                        13, place Alphonse-Fiquet<br />
                        80000 Amiens<br />
                        <span className="text-gray-500">Tél: 03 22 XX XX XX</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <Link href="/" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700"
                        >
                            Retour à l'accueil
                        </Button>
                    </Link>
                    <Link href="/book" className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Nouveau rendez-vous
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
