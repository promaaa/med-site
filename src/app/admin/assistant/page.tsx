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
    Square
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

export default function AssistantPage() {
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
            }
        } catch (error) {
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
                fetchStatus();
            }
        } catch (error) {
            console.error('Error controlling assistant:', error);
        }
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assistant Vocal IA</h1>
                    <p className="text-gray-600 mt-1">
                        Surveillance et contrôle de l'assistant téléphonique
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isConnected ? 'Connecté' : 'Déconnecté'}
                    </div>
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
                    <li>• L'IVR leur propose des options (RDV, urgence, autre)</li>
                    <li>• L'assistant IA gère les prises de rendez-vous automatiquement</li>
                    <li>• Les urgences sont transférées directement sur votre mobile</li>
                </ul>
            </div>
        </div>
    );
}
