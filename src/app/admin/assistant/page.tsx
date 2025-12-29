'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Phone,
    Mic,
    Volume2,
    Brain,
    Server,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle,
    PhoneIncoming,
    MessageSquare,
    Play,
    Square,
    Settings,
    History,
    PhoneCall,
    Clock,
    User,
    Calendar,
    ChevronRight,
    Smartphone,
    Globe,
    Save,
    TestTube
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceStatus {
    name: string;
    status: 'running' | 'stopped' | 'error' | 'loading';
    port: number;
    icon: React.ElementType;
}

interface Stats {
    calls: number;
    transcriptions: number;
    responses: number;
    errors: number;
}

interface Log {
    timestamp: string;
    level: 'INFO' | 'OK' | 'ERROR' | 'WARN';
    message: string;
}

interface CallRecord {
    id: string;
    timestamp: string;
    duration: string;
    callerNumber: string;
    status: 'completed' | 'missed' | 'transferred';
    summary?: string;
}

interface TelephonyConfig {
    provider: string;
    sipServer: string;
    sipUsername: string;
    doctorPhone: string;
    configured: boolean;
}

export default function AssistantPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'calls' | 'config'>('dashboard');
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: 'Asterisk PBX', status: 'loading', port: 5060, icon: Phone },
        { name: 'Ollama LLM', status: 'loading', port: 11434, icon: Brain },
        { name: 'Coqui TTS', status: 'loading', port: 5555, icon: Volume2 },
        { name: 'Assistant IA', status: 'loading', port: 9001, icon: Mic },
    ]);

    const [stats, setStats] = useState<Stats>({
        calls: 0,
        transcriptions: 0,
        responses: 0,
        errors: 0
    });

    const [logs, setLogs] = useState<Log[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [assistantRunning, setAssistantRunning] = useState(false);

    // Call history
    const [callHistory, setCallHistory] = useState<CallRecord[]>([
        { id: '1', timestamp: '2024-12-29 11:30', duration: '3:45', callerNumber: '06 12 34 56 78', status: 'completed', summary: 'Prise de RDV pour consultation' },
        { id: '2', timestamp: '2024-12-29 10:15', duration: '1:20', callerNumber: '07 98 76 54 32', status: 'transferred', summary: 'Urgence - Transfert au médecin' },
        { id: '3', timestamp: '2024-12-29 09:45', duration: '0:00', callerNumber: '01 23 45 67 89', status: 'missed', summary: 'Appel manqué' },
    ]);

    // Telephony config
    const [telephonyConfig, setTelephonyConfig] = useState<TelephonyConfig>({
        provider: 'ovh',
        sipServer: '',
        sipUsername: '',
        doctorPhone: '',
        configured: false
    });
    const [configSaved, setConfigSaved] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/assistant/status');
            if (response.ok) {
                const data = await response.json();
                setServices(prev => prev.map(s => ({
                    ...s,
                    status: data.services[s.name.toLowerCase().replace(' ', '_')] ? 'running' : 'stopped'
                })));
                setStats(data.stats || stats);
                setLogs(data.logs || []);
                setIsConnected(true);
                setAssistantRunning(data.running || false);
                if (data.telephonyConfig) {
                    setTelephonyConfig(prev => ({ ...prev, ...data.telephonyConfig, configured: true }));
                }
            }
        } catch {
            setIsConnected(false);
            setServices(prev => prev.map(s => ({ ...s, status: 'error' })));
        }
    }, [stats]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    const handleStartStop = async () => {
        try {
            const response = await fetch('/api/assistant/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: assistantRunning ? 'stop' : 'start' })
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchStatus();
            }
        } catch (error) {
            console.error('Error controlling assistant:', error);
        }
    };

    const handleSaveConfig = async () => {
        try {
            const response = await fetch('/api/assistant/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(telephonyConfig)
            });
            if (response.ok) {
                setConfigSaved(true);
                setTimeout(() => setConfigSaved(false), 3000);
                setTelephonyConfig(prev => ({ ...prev, configured: true }));
            }
        } catch (error) {
            console.error('Error saving config:', error);
        }
    };

    const handleTestCall = async () => {
        alert('Test d\'appel lancé! Vérifiez la console du dashboard python.');
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'running':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'stopped':
                return <XCircle className="w-5 h-5 text-gray-400" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'bg-green-50 border-green-200';
            case 'stopped': return 'bg-gray-50 border-gray-200';
            case 'error': return 'bg-red-50 border-red-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    const getLogColor = (level: string) => {
        switch (level) {
            case 'OK': return 'text-green-600';
            case 'ERROR': return 'text-red-600';
            case 'WARN': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getCallStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Terminé</span>;
            case 'transferred':
                return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Transféré</span>;
            case 'missed':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Manqué</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assistant Vocal IA</h1>
                    <p className="text-gray-600 mt-1">
                        Surveillance et contrôle de l&apos;assistant téléphonique
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isConnected ? 'Connecté' : 'Déconnecté'}
                    </div>
                    <Button
                        onClick={handleTestCall}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <TestTube className="w-4 h-4" />
                        Test
                    </Button>
                    <Button
                        onClick={handleStartStop}
                        variant={assistantRunning ? 'destructive' : 'default'}
                        className="flex items-center gap-2"
                    >
                        {assistantRunning ? (
                            <>
                                <Square className="w-4 h-4" />
                                Arrêter
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Démarrer
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Server className="w-4 h-4 inline mr-2" />
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('calls')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'calls'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <History className="w-4 h-4 inline mr-2" />
                    Historique
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'config'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Configuration
                </button>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
                <>
                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {services.map((service) => (
                            <div
                                key={service.name}
                                className={`p-4 rounded-xl border-2 transition-all ${getStatusColor(service.status)}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <service.icon className="w-8 h-8 text-gray-700" />
                                    {getStatusIcon(service.status)}
                                </div>
                                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                <p className="text-sm text-gray-500">Port {service.port}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <PhoneIncoming className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.calls}</p>
                                    <p className="text-sm text-gray-500">Appels reçus</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Mic className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.transcriptions}</p>
                                    <p className="text-sm text-gray-500">Transcriptions</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.responses}</p>
                                    <p className="text-sm text-gray-500">Réponses TTS</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stats.errors}</p>
                                    <p className="text-sm text-gray-500">Erreurs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="bg-gray-900 rounded-xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Server className="w-5 h-5" />
                                Logs en temps réel
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={fetchStatus}
                                className="text-gray-400 hover:text-white"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                            {logs.length === 0 ? (
                                <p className="text-gray-500 italic">En attente de logs...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-gray-500">{log.timestamp}</span>
                                        <span className={getLogColor(log.level)}>[{log.level}]</span>
                                        <span className="text-gray-300">{log.message}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">💡 Comment ça fonctionne</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Les patients appellent votre numéro de cabinet</li>
                            <li>• L&apos;IVR leur propose des options (RDV, urgence, autre)</li>
                            <li>• L&apos;assistant IA gère les prises de rendez-vous automatiquement</li>
                            <li>• Les urgences sont transférées directement sur votre mobile</li>
                        </ul>
                    </div>
                </>
            )}

            {/* Calls History Tab */}
            {activeTab === 'calls' && (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Historique des appels
                        </h3>
                    </div>
                    <div className="divide-y">
                        {callHistory.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <PhoneCall className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Aucun appel enregistré</p>
                            </div>
                        ) : (
                            callHistory.map((call) => (
                                <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${call.status === 'completed' ? 'bg-green-100' :
                                                    call.status === 'transferred' ? 'bg-blue-100' : 'bg-red-100'
                                                }`}>
                                                <PhoneCall className={`w-5 h-5 ${call.status === 'completed' ? 'text-green-600' :
                                                        call.status === 'transferred' ? 'text-blue-600' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{call.callerNumber}</span>
                                                    {getCallStatusBadge(call.status)}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {call.timestamp}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {call.duration}
                                                    </span>
                                                </div>
                                                {call.summary && (
                                                    <p className="mt-1 text-sm text-gray-600">{call.summary}</p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
                <div className="space-y-6">
                    {/* Telephony Config */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Configuration Téléphonie
                        </h3>

                        <div className="space-y-4">
                            {/* Provider */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opérateur SIP
                                </label>
                                <select
                                    value={telephonyConfig.provider}
                                    onChange={(e) => setTelephonyConfig(prev => ({ ...prev, provider: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="ovh">OVH Télécom</option>
                                    <option value="twilio">Twilio</option>
                                    <option value="free">Free SIP (Freebox)</option>
                                    <option value="custom">Autre</option>
                                </select>
                            </div>

                            {/* SIP Server */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Globe className="w-4 h-4 inline mr-1" />
                                    Serveur SIP
                                </label>
                                <input
                                    type="text"
                                    value={telephonyConfig.sipServer}
                                    onChange={(e) => setTelephonyConfig(prev => ({ ...prev, sipServer: e.target.value }))}
                                    placeholder="siptrunk.ovh.net"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* SIP Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <User className="w-4 h-4 inline mr-1" />
                                    Identifiant SIP
                                </label>
                                <input
                                    type="text"
                                    value={telephonyConfig.sipUsername}
                                    onChange={(e) => setTelephonyConfig(prev => ({ ...prev, sipUsername: e.target.value }))}
                                    placeholder="0033XXXXXXXXX"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Doctor Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Smartphone className="w-4 h-4 inline mr-1" />
                                    Téléphone du médecin (urgences)
                                </label>
                                <input
                                    type="text"
                                    value={telephonyConfig.doctorPhone}
                                    onChange={(e) => setTelephonyConfig(prev => ({ ...prev, doctorPhone: e.target.value }))}
                                    placeholder="06 12 34 56 78"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Les appels urgents seront transférés sur ce numéro
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button onClick={handleSaveConfig} className="flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {configSaved ? 'Configuration sauvegardée ✓' : 'Sauvegarder'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* IVR Menu Config */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Menu vocal (IVR)
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">1</span>
                                <div>
                                    <p className="font-medium text-gray-900">Gestion des rendez-vous</p>
                                    <p className="text-sm text-gray-500">→ Assistant IA</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">2</span>
                                <div>
                                    <p className="font-medium text-gray-900">Urgence médicale</p>
                                    <p className="text-sm text-gray-500">→ Transfert au médecin</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">3</span>
                                <div>
                                    <p className="font-medium text-gray-900">Autre demande</p>
                                    <p className="text-sm text-gray-500">→ Assistant IA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className={`rounded-xl p-4 ${telephonyConfig.configured ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className="flex items-center gap-3">
                            {telephonyConfig.configured ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            )}
                            <div>
                                <p className={`font-medium ${telephonyConfig.configured ? 'text-green-900' : 'text-yellow-900'}`}>
                                    {telephonyConfig.configured ? 'Téléphonie configurée' : 'Configuration requise'}
                                </p>
                                <p className={`text-sm ${telephonyConfig.configured ? 'text-green-700' : 'text-yellow-700'}`}>
                                    {telephonyConfig.configured
                                        ? 'Votre assistant est prêt à recevoir des appels'
                                        : 'Remplissez les informations ci-dessus pour activer la téléphonie'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
