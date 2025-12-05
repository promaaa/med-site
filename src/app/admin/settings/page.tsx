"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Mail, Settings, CheckCircle, AlertCircle, Upload, Link2, Save, Plus, X, Coffee } from "lucide-react";

type Settings = {
    // Google Calendar
    googleServiceAccountEmail: string;
    googleCalendarId: string;
    // Work hours
    workStartHour: number;
    workEndHour: number;
    slotDurationMinutes: number;
    // Lunch break
    lunchBreakEnabled: boolean;
    lunchBreakStart: string;
    lunchBreakEnd: string;
    // Notifications
    adminEmail: string;
    // Appointment reasons
    appointmentReasons: string;
};

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [jsonFile, setJsonFile] = useState<File | null>(null);
    const [jsonPreview, setJsonPreview] = useState<{ email: string; projectId: string } | null>(null);
    const [resendApiKey, setResendApiKey] = useState("");
    const [fromEmail, setFromEmail] = useState("");
    const [activeTab, setActiveTab] = useState<'calendar' | 'hours' | 'email' | 'custom'>('calendar');

    const [settings, setSettings] = useState<Settings>({
        googleServiceAccountEmail: "",
        googleCalendarId: "primary",
        workStartHour: 9,
        workEndHour: 17,
        slotDurationMinutes: 30,
        lunchBreakEnabled: true,
        lunchBreakStart: "12:00",
        lunchBreakEnd: "14:00",
        adminEmail: "",
        appointmentReasons: '["Consultation générale","Renouvellement ordonnance","Suivi médical","Vaccination","Certificat médical","Autre"]',
    });

    const [reasons, setReasons] = useState<string[]>([]);

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
                        lunchBreakEnabled: data.settings.lunchBreakEnabled ?? true,
                        lunchBreakStart: data.settings.lunchBreakStart || "12:00",
                        lunchBreakEnd: data.settings.lunchBreakEnd || "14:00",
                        adminEmail: data.settings.adminEmail || "",
                        appointmentReasons: data.settings.appointmentReasons || '[]',
                    });
                    try {
                        setReasons(JSON.parse(data.settings.appointmentReasons || '[]'));
                    } catch {
                        setReasons([]);
                    }
                }
                if (data.env) {
                    setResendApiKey(data.env.resendConfigured ? "••••••••••" : "");
                    setFromEmail(data.env.fromEmail || "");
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
                setMessage(`Configuration Google Calendar mise à jour ! Email: ${data.email}`);
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
                body: JSON.stringify({
                    ...settings,
                    appointmentReasons: JSON.stringify(reasons),
                }),
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

    const handleEnvUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/admin/settings/env", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resendApiKey: resendApiKey.includes("•") ? undefined : resendApiKey,
                    fromEmail,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Configuration email mise à jour !");
                if (resendApiKey && !resendApiKey.includes("•")) {
                    setResendApiKey("••••••••••");
                }
            } else {
                setError(data.error || "Erreur lors de la mise à jour");
            }
        } catch {
            setError("Erreur lors de la mise à jour");
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

    const addReason = () => {
        setReasons([...reasons, ""]);
    };

    const updateReason = (index: number, value: string) => {
        const updated = [...reasons];
        updated[index] = value;
        setReasons(updated);
    };

    const removeReason = (index: number) => {
        setReasons(reasons.filter((_, i) => i !== index));
    };

    const tabs = [
        { id: 'calendar', label: 'Calendrier', Icon: Calendar },
        { id: 'hours', label: 'Horaires', Icon: Clock },
        { id: 'email', label: 'Emails', Icon: Mail },
        { id: 'custom', label: 'Personnalisation', Icon: Settings },
    ] as const;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
                <p className="text-gray-600 mt-1">
                    Paramétrez votre système de rendez-vous
                </p>
            </div>

            {message && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 font-medium flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {message}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Google Calendar</h2>
                        <p className="text-gray-600 mt-1">Synchronisez vos rendez-vous avec Google Calendar</p>
                    </div>

                    {/* Current Status */}
                    <div className={`p-4 rounded-lg ${settings.googleServiceAccountEmail
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                        <p className={`font-semibold ${settings.googleServiceAccountEmail ? 'text-green-800' : 'text-yellow-800'}`}>
                            {settings.googleServiceAccountEmail ? 'Configuré' : 'Non configuré'}
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
                                className="bg-white border-gray-300"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Téléchargez le fichier depuis Google Cloud Console → IAM → Comptes de service
                            </p>
                        </div>

                        {jsonPreview && (
                            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <p className="font-semibold text-blue-800">Aperçu :</p>
                                <p className="text-sm text-blue-700 mt-1">Email : <span className="font-mono">{jsonPreview.email}</span></p>
                                <p className="text-sm text-blue-700">Projet : <span className="font-mono">{jsonPreview.projectId}</span></p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading || !jsonFile} className="bg-blue-600 hover:bg-blue-700 text-white">
                                {loading ? "Upload..." : "📤 Uploader"}
                            </Button>
                            {settings.googleServiceAccountEmail && (
                                <Button type="button" variant="outline" onClick={testCalendarConnection} disabled={loading}>
                                    Tester
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="pt-4 border-t">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ID du calendrier
                        </label>
                        <Input
                            type="text"
                            value={settings.googleCalendarId}
                            onChange={(e) => setSettings({ ...settings, googleCalendarId: e.target.value })}
                            placeholder="primary ou email@gmail.com"
                            className="bg-white border-gray-300"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            "primary" = calendrier principal, ou l'email du calendrier partagé
                        </p>
                        <Button onClick={handleSettingsUpdate} disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Enregistrer
                        </Button>
                    </div>
                </div>
            )}

            {/* Hours Tab */}
            {activeTab === 'hours' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Horaires de travail</h2>
                        <p className="text-gray-600 mt-1">Définissez vos plages de consultation</p>
                    </div>

                    <form onSubmit={handleSettingsUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Heure de début</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={settings.workStartHour}
                                    onChange={(e) => setSettings({ ...settings, workStartHour: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Heure de fin</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={settings.workEndHour}
                                    onChange={(e) => setSettings({ ...settings, workEndHour: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Durée créneaux (min)</label>
                                <select
                                    value={settings.slotDurationMinutes}
                                    onChange={(e) => setSettings({ ...settings, slotDurationMinutes: parseInt(e.target.value) })}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white"
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={20}>20 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>1 heure</option>
                                </select>
                            </div>
                        </div>

                        {/* Lunch Break */}
                        <div className="pt-4 border-t">
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    id="lunchBreak"
                                    checked={settings.lunchBreakEnabled}
                                    onChange={(e) => setSettings({ ...settings, lunchBreakEnabled: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <label htmlFor="lunchBreak" className="font-semibold text-gray-700">
                                    Activer la pause déjeuner
                                </label>
                            </div>

                            {settings.lunchBreakEnabled && (
                                <div className="grid grid-cols-2 gap-4 ml-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Début</label>
                                        <Input
                                            type="time"
                                            value={settings.lunchBreakStart}
                                            onChange={(e) => setSettings({ ...settings, lunchBreakStart: e.target.value })}
                                            className="bg-white border-gray-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fin</label>
                                        <Input
                                            type="time"
                                            value={settings.lunchBreakEnd}
                                            onChange={(e) => setSettings({ ...settings, lunchBreakEnd: e.target.value })}
                                            className="bg-white border-gray-300"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Enregistrer les horaires
                        </Button>
                    </form>
                </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Configuration Email</h2>
                        <p className="text-gray-600 mt-1">Configurez Resend pour l'envoi d'emails de confirmation</p>
                    </div>

                    <div className={`p-4 rounded-lg ${resendApiKey
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                        <p className={`font-semibold ${resendApiKey ? 'text-green-800' : 'text-yellow-800'}`}>
                            {resendApiKey ? 'Resend configuré' : 'Resend non configuré - les emails ne seront pas envoyés'}
                        </p>
                    </div>

                    <form onSubmit={handleEnvUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Clé API Resend
                            </label>
                            <Input
                                type="password"
                                value={resendApiKey}
                                onChange={(e) => setResendApiKey(e.target.value)}
                                placeholder="re_xxxxxxxx"
                                className="bg-white border-gray-300 font-mono"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Obtenez votre clé sur <a href="https://resend.com" target="_blank" className="text-blue-600 hover:underline">resend.com</a> (gratuit : 100 emails/jour)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email expéditeur
                            </label>
                            <Input
                                type="text"
                                value={fromEmail}
                                onChange={(e) => setFromEmail(e.target.value)}
                                placeholder="Cabinet Dr. Martin <contact@votre-domaine.com>"
                                className="bg-white border-gray-300"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Format : "Nom &lt;email@domaine.com&gt;" - Nécessite un domaine vérifié sur Resend
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email de notification (pour les annulations)
                            </label>
                            <Input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                placeholder="votre-email@exemple.com"
                                className="bg-white border-gray-300"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Recevez une notification quand un patient annule son rendez-vous
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Enregistrer
                            </Button>
                            <Button type="button" variant="outline" onClick={handleSettingsUpdate} disabled={loading}>
                                Enregistrer email admin
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Customization Tab */}
            {activeTab === 'custom' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Personnalisation</h2>
                        <p className="text-gray-600 mt-1">Personnalisez les motifs de rendez-vous</p>
                    </div>

                    <form onSubmit={handleSettingsUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Motifs de rendez-vous
                            </label>
                            <p className="text-sm text-gray-500 mb-4">
                                Ces motifs apparaîtront dans la liste déroulante lors de la prise de rendez-vous
                            </p>

                            <div className="space-y-2">
                                {reasons.map((reason, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={reason}
                                            onChange={(e) => updateReason(index, e.target.value)}
                                            placeholder="Ex: Consultation générale"
                                            className="bg-white border-gray-300 flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeReason(index)}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button type="button" variant="outline" onClick={addReason} className="mt-3">
                                + Ajouter un motif
                            </Button>
                        </div>

                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Enregistrer
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
}
