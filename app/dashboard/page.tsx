"use client"

export default function Dashboard() {
    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm text-gray-500">Bienvenue sur le tableau de bord Fidio Admin</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Électeurs inscrits", value: "4 821", sub: "depuis janvier", pct: 72, color: "#00843D", badge: "+3.2%" },
                    { label: "Votes enregistrés", value: "18 340", sub: "ce cycle", pct: 58, color: "#00843D", badge: "+18%" },
                    { label: "Tickets ouverts", value: "37", sub: "3 urgents", pct: 37, color: "#F9423A", badge: "+5" },
                    { label: "Participation moy.", value: "64%", sub: "objectif 70%", pct: 64, color: "#BA7517", badge: "stable" },
                ].map(m => (
                    <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                            <span className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                {m.badge}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{m.value}</div>
                        <div className="text-xs text-gray-400 mb-3">{m.sub}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${m.pct}%`, backgroundColor: m.color }} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-[#00843D]/10 border border-[#00843D]/20 rounded-lg hover:bg-[#00843D]/20 transition-colors">
                        <div className="w-10 h-10 bg-[#00843D] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">+</span>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Nouvelle élection</div>
                            <div className="text-xs text-gray-500">Créer une élection</div>
                        </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">👥</span>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Gérer les candidats</div>
                            <div className="text-xs text-gray-500">Ajouter/modifier</div>
                        </div>
                    </button>
                    
                    <button className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">📊</span>
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-gray-900">Voir les résultats</div>
                            <div className="text-xs text-gray-500">Statistiques détaillées</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
                <div className="space-y-3">
                    {[
                        { user: "Rakoto A.", action: "Vote enregistré", time: "Il y a 5 min", status: "success" },
                        { user: "Rabe M.", action: "Nouveau candidat ajouté", time: "Il y a 15 min", status: "info" },
                        { user: "Rasoa F.", action: "Élection créée", time: "Il y a 1 heure", status: "success" },
                        { user: "Admin", action: "Système mis à jour", time: "Il y a 2 heures", status: "warning" },
                    ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    activity.status === "success" ? "bg-green-500" :
                                    activity.status === "info" ? "bg-blue-500" :
                                    activity.status === "warning" ? "bg-amber-500" : "bg-gray-500"
                                }`} />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                                    <div className="text-xs text-gray-500">par {activity.user}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white">✓</span>
                    </div>
                    <div>
                        <div className="font-medium text-green-900">Système opérationnel</div>
                        <div className="text-sm text-green-700">Tous les services fonctionnent normalement</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
