"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [jsonFile, setJsonFile] = useState<File | null>(null);
    const [jsonPreview, setJsonPreview] = useState<{ email: string; projectId: string } | null>(null);
    const [settings, setSettings] = useState({
        googleServiceAccountEmail: "",
        googleCalendarId: "primary",
        workStartHour: 9,
        workEndHour: 17,
        slotDurationMinutes: 30,
    });

    const router = useRouter();

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (data.settings) {
                    setSettings({
                        googleServiceAccountEmail: data.settings.googleServiceAccountEmail || "",
                        googleCalendarId: data.settings.googleCalendarId || "primary",
                        workStartHour: data.settings.workStartHour || 9,
                        workEndHour: data.settings.workEndHour || 17,
                        slotDurationMinutes: data.settings.slotDurationMinutes || 30,
                    });
                }
            })
            .catch(console.error);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setJsonFile(file);
        setJsonPreview(null);
        setError("");

        if (file) {
            try {
                const content = await file.text();
                const json = JSON.parse(content);
                if (json.client_email && json.private_key) {
                    setJsonPreview({
                        email: json.client_email,
                        projectId: json.project_id || "N/A",
                    });
                } else {
                    setError("Ce fichier ne contient pas les champs requis (client_email, private_key)");
                }
            } catch {
                setError("Fichier JSON invalide");
            }
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jsonFile) {
            setError("Veuillez sélectionner un fichier JSON");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const fileContent = await jsonFile.text();
            const jsonData = JSON.parse(fileContent);

            const response = await fetch("/api/admin/settings/upload-json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Configuration mise à jour ! Email: ${data.email}`);
                setSettings(prev => ({ ...prev, googleServiceAccountEmail: data.email }));
                setJsonFile(null);
                setJsonPreview(null);
            } else {
                setError(data.error || "Erreur lors de la mise à jour");
            }
        } catch {
            setError("Erreur : le fichier JSON est invalide");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Paramètres enregistrés avec succès !");
            } else {
                setError(data.error || "Erreur lors de la mise à jour");
            }
        } catch {
            setError("Erreur lors de la mise à jour des paramètres");
        } finally {
            setLoading(false);
        }
    };

    const testCalendarConnection = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/settings/test-calendar");
            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
            } else {
                setError(data.error || "Erreur de connexion");
            }
        } catch {
            setError("Erreur lors du test de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
                <p className="text-gray-600 mt-1">
                    Gérez les paramètres de votre système de rendez-vous
                </p>
            </div>

            {message && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 font-medium">
                    ✅ {message}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 font-medium">
                    ❌ {error}
                </div>
            )}

            {/* Google Calendar Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        📅 Google Calendar
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Synchronisez vos rendez-vous avec Google Calendar
                    </p>
                </div>

                {/* Current Status */}
                <div className={`p-4 rounded-lg ${settings.googleServiceAccountEmail
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                    <p className={`font-semibold ${settings.googleServiceAccountEmail ? 'text-green-800' : 'text-yellow-800'}`}>
                        {settings.googleServiceAccountEmail ? '✅ Configuré' : '⚠️ Non configuré'}
                    </p>
                    {settings.googleServiceAccountEmail && (
                        <p className="text-sm text-green-700 mt-1">
                            Compte de service : <span className="font-mono">{settings.googleServiceAccountEmail}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fichier JSON du compte de service
                        </label>
                        <Input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Téléchargez le fichier JSON depuis Google Cloud Console → IAM → Comptes de service
                        </p>
                    </div>

                    {jsonPreview && (
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="font-semibold text-blue-800">📋 Aperçu du fichier :</p>
                            <p className="text-sm text-blue-700 mt-1">Email : <span className="font-mono">{jsonPreview.email}</span></p>
                            <p className="text-sm text-blue-700">Projet : <span className="font-mono">{jsonPreview.projectId}</span></p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={loading || !jsonFile}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? "Upload..." : "📤 Uploader la configuration"}
                        </Button>

                        {settings.googleServiceAccountEmail && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={testCalendarConnection}
                                disabled={loading}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                🔗 Tester la connexion
                            </Button>
                        )}
                    </div>
                </form>

                {/* Help Section */}
                <div className="pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-700 mb-2">📖 Instructions :</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                        <li>Créez un projet sur <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                        <li>Activez l'API Google Calendar</li>
                        <li>Créez un compte de service et téléchargez le JSON</li>
                        <li>Partagez votre calendrier avec l'email du compte de service</li>
                        <li>Uploadez le fichier JSON ici</li>
                    </ol>
                </div>
            </div>

            {/* Work Hours Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        ⏰ Horaires de travail
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Définissez vos horaires de consultation
                    </p>
                </div>

                <form onSubmit={handleSettingsUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Heure de début
                            </label>
                            <Input
                                type="number"
                                min="0"
                                max="23"
                                value={settings.workStartHour}
                                onChange={(e) => setSettings({ ...settings, workStartHour: parseInt(e.target.value) })}
                                className="bg-white border-gray-300 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Heure de fin
                            </label>
                            <Input
                                type="number"
                                min="0"
                                max="23"
                                value={settings.workEndHour}
                                onChange={(e) => setSettings({ ...settings, workEndHour: parseInt(e.target.value) })}
                                className="bg-white border-gray-300 text-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Durée créneaux (min)
                            </label>
                            <Input
                                type="number"
                                min="15"
                                max="120"
                                step="15"
                                value={settings.slotDurationMinutes}
                                onChange={(e) => setSettings({ ...settings, slotDurationMinutes: parseInt(e.target.value) })}
                                className="bg-white border-gray-300 text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ID du calendrier Google
                        </label>
                        <Input
                            type="text"
                            value={settings.googleCalendarId}
                            onChange={(e) => setSettings({ ...settings, googleCalendarId: e.target.value })}
                            placeholder="primary"
                            className="bg-white border-gray-300 text-gray-900"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Utilisez "primary" pour le calendrier principal, ou l'adresse email du calendrier partagé
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Enregistrement..." : "💾 Enregistrer les paramètres"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
