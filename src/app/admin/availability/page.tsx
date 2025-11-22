export default function AvailabilityPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Gérer les disponibilités</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
                <p className="text-slate-600 mb-4">
                    Ici, vous pouvez définir vos heures de travail et vos créneaux de disponibilité spécifiques.
                </p>
                <p className="text-sm text-slate-500">
                    (Fonctionnalité en cours de développement. Les heures par défaut sont de 9h00 à 17h00 du lundi au vendredi)
                </p>
                {/* Future: Add form to create AvailabilitySlot records */}
            </div>
        </div>
    );
}
