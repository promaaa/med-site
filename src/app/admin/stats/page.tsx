'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Stats = {
    currentMonth: {
        label: string;
        confirmed: number;
        cancelled: number;
        total: number;
        cancellationRate: number;
    };
    lastMonth: {
        label: string;
        confirmed: number;
        cancelled: number;
        total: number;
    };
    growth: number;
    dailyData: { date: string; label: string; confirmed: number; cancelled: number; total: number }[];
    popularHours: { hour: number; count: number }[];
    popularReasons: { reason: string; count: number }[];
};

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) {
        return <div className="text-red-600">Erreur lors du chargement des statistiques</div>;
    }

    const maxDaily = Math.max(...stats.dailyData.map(d => d.total), 1);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
                <p className="text-gray-600">{stats.currentMonth.label}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-500">RDV ce mois</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.currentMonth.confirmed}</p>
                    <p className={`text-sm mt-2 ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.growth)}% vs mois dernier
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-500">Annulations</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.currentMonth.cancelled}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Taux: {stats.currentMonth.cancellationRate}%
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-500">Mois précédent</p>
                    <p className="text-3xl font-bold text-gray-400 mt-1">{stats.lastMonth.confirmed}</p>
                    <p className="text-sm text-gray-400 mt-2">{stats.lastMonth.label}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-sm text-gray-500">Total ce mois</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.currentMonth.total}</p>
                    <p className="text-sm text-gray-500 mt-2">confirmés + annulés</p>
                </div>
            </div>

            {/* Daily Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendez-vous par jour</h2>
                <div className="flex items-end gap-1 h-40 overflow-x-auto">
                    {stats.dailyData.map((day, i) => (
                        <div key={day.date} className="flex flex-col items-center min-w-[20px]">
                            <div className="flex flex-col-reverse w-full">
                                {day.confirmed > 0 && (
                                    <div
                                        className="bg-blue-500 w-full"
                                        style={{ height: `${(day.confirmed / maxDaily) * 100}px` }}
                                        title={`${day.confirmed} confirmé(s)`}
                                    />
                                )}
                                {day.cancelled > 0 && (
                                    <div
                                        className="bg-red-400 w-full"
                                        style={{ height: `${(day.cancelled / maxDaily) * 100}px` }}
                                        title={`${day.cancelled} annulé(s)`}
                                    />
                                )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{day.label}</span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-gray-600">Confirmés</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded"></div>
                        <span className="text-gray-600">Annulés</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Popular Hours */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Heures populaires</h2>
                    {stats.popularHours.length > 0 ? (
                        <div className="space-y-3">
                            {stats.popularHours.map((item, i) => (
                                <div key={item.hour} className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                                    <span className="font-medium text-gray-900">{item.hour}h00</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${(item.count / stats.popularHours[0].count) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500">{item.count} RDV</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Pas encore de données</p>
                    )}
                </div>

                {/* Popular Reasons */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Motifs fréquents</h2>
                    {stats.popularReasons.length > 0 ? (
                        <div className="space-y-3">
                            {stats.popularReasons.map((item, i) => (
                                <div key={item.reason} className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                                    <span className="font-medium text-gray-900 flex-1 truncate">{item.reason}</span>
                                    <span className="text-sm text-gray-500">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Pas encore de données</p>
                    )}
                </div>
            </div>
        </div>
    );
}
