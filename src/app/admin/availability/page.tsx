'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DaySchedule = {
    enabled: boolean;
    startTime: string;
    endTime: string;
};

type WeekSchedule = {
    [key: number]: DaySchedule;
};

const dayNames: { [key: number]: string } = {
    1: "Lundi",
    2: "Mardi",
    3: "Mercredi",
    4: "Jeudi",
    5: "Vendredi",
    6: "Samedi",
    0: "Dimanche",
};

const defaultSchedule: WeekSchedule = {
    1: { enabled: true, startTime: "09:00", endTime: "12:00" },
    2: { enabled: true, startTime: "09:00", endTime: "12:00" },
    3: { enabled: true, startTime: "09:00", endTime: "12:00" },
    4: { enabled: true, startTime: "09:00", endTime: "12:00" },
    5: { enabled: true, startTime: "09:00", endTime: "12:00" },
    6: { enabled: false, startTime: "09:00", endTime: "12:00" },
    0: { enabled: false, startTime: "09:00", endTime: "12:00" },
};

const defaultAfternoonSchedule: WeekSchedule = {
    1: { enabled: true, startTime: "14:00", endTime: "18:00" },
    2: { enabled: true, startTime: "14:00", endTime: "18:00" },
    3: { enabled: true, startTime: "14:00", endTime: "18:00" },
    4: { enabled: true, startTime: "14:00", endTime: "18:00" },
    5: { enabled: true, startTime: "14:00", endTime: "18:00" },
    6: { enabled: false, startTime: "14:00", endTime: "18:00" },
    0: { enabled: false, startTime: "14:00", endTime: "18:00" },
};

export default function AvailabilityPage() {
    const [morningSchedule, setMorningSchedule] = useState<WeekSchedule>(defaultSchedule);
    const [afternoonSchedule, setAfternoonSchedule] = useState<WeekSchedule>(defaultAfternoonSchedule);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [newBlockedDate, setNewBlockedDate] = useState("");

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/admin/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    morning: morningSchedule,
                    afternoon: afternoonSchedule,
                    blockedDates,
                }),
            });

            if (response.ok) {
                setMessage("success");
            } else {
                setMessage("error");
            }
        } catch {
            setMessage("error");
        } finally {
            setLoading(false);
        }
    };

    const addBlockedDate = () => {
        if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
            setBlockedDates([...blockedDates, newBlockedDate]);
            setNewBlockedDate("");
        }
    };

    const removeBlockedDate = (date: string) => {
        setBlockedDates(blockedDates.filter(d => d !== date));
    };

    const updateMorning = (day: number, field: keyof DaySchedule, value: string | boolean) => {
        setMorningSchedule({
            ...morningSchedule,
            [day]: { ...morningSchedule[day], [field]: value }
        });
    };

    const updateAfternoon = (day: number, field: keyof DaySchedule, value: string | boolean) => {
        setAfternoonSchedule({
            ...afternoonSchedule,
            [day]: { ...afternoonSchedule[day], [field]: value }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Disponibilités</h1>
                <p className="text-gray-600 mt-1">
                    Gérez vos horaires de consultation
                </p>
            </div>

            {message === "success" && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 font-medium">
                    Disponibilités enregistrées avec succès !
                </div>
            )}

            {message === "error" && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 font-medium">
                    Erreur lors de l'enregistrement
                </div>
            )}

            {/* Weekly Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Horaires hebdomadaires</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-2 font-semibold text-gray-700">Jour</th>
                                <th className="text-center py-3 px-2 font-semibold text-gray-700" colSpan={3}>Matin</th>
                                <th className="text-center py-3 px-2 font-semibold text-gray-700" colSpan={3}>Après-midi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                                <tr key={day} className="border-b border-gray-100">
                                    <td className="py-3 px-2 font-medium text-gray-900">{dayNames[day]}</td>
                                    {/* Morning */}
                                    <td className="py-3 px-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={morningSchedule[day].enabled}
                                            onChange={(e) => updateMorning(day, "enabled", e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <Input
                                            type="time"
                                            value={morningSchedule[day].startTime}
                                            onChange={(e) => updateMorning(day, "startTime", e.target.value)}
                                            disabled={!morningSchedule[day].enabled}
                                            className="w-28 bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <Input
                                            type="time"
                                            value={morningSchedule[day].endTime}
                                            onChange={(e) => updateMorning(day, "endTime", e.target.value)}
                                            disabled={!morningSchedule[day].enabled}
                                            className="w-28 bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </td>
                                    {/* Afternoon */}
                                    <td className="py-3 px-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={afternoonSchedule[day].enabled}
                                            onChange={(e) => updateAfternoon(day, "enabled", e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <Input
                                            type="time"
                                            value={afternoonSchedule[day].startTime}
                                            onChange={(e) => updateAfternoon(day, "startTime", e.target.value)}
                                            disabled={!afternoonSchedule[day].enabled}
                                            className="w-28 bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </td>
                                    <td className="py-3 px-2">
                                        <Input
                                            type="time"
                                            value={afternoonSchedule[day].endTime}
                                            onChange={(e) => updateAfternoon(day, "endTime", e.target.value)}
                                            disabled={!afternoonSchedule[day].enabled}
                                            className="w-28 bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Blocked Dates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Jours de fermeture exceptionnelle</h2>
                    <p className="text-gray-600 mt-1">
                        Ajoutez les dates où le cabinet sera fermé (congés, jours fériés, etc.)
                    </p>
                </div>

                <div className="flex gap-3">
                    <Input
                        type="date"
                        value={newBlockedDate}
                        onChange={(e) => setNewBlockedDate(e.target.value)}
                        className="w-48 bg-white border-gray-300 text-gray-900"
                    />
                    <Button
                        onClick={addBlockedDate}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        + Ajouter
                    </Button>
                </div>

                {blockedDates.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {blockedDates.map((date) => (
                            <div
                                key={date}
                                className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
                            >
                                {new Date(date).toLocaleDateString("fr-FR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                                <button
                                    onClick={() => removeBlockedDate(date)}
                                    className="hover:text-red-900 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                    {loading ? "Enregistrement..." : "💾 Enregistrer les disponibilités"}
                </Button>
            </div>
        </div>
    );
}
