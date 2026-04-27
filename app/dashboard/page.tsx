"use client"
import { useRouter, usePathname } from "next/navigation"
import { AuthUseProvider } from "../Context/Auth"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, LineElement, PointElement, Tooltip
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip)

const elections = [
    { id: 1, name: "Présidentielle 2025", dates: "12–14 mai 2025", status: "live", participation: 71 },
    { id: 2, name: "Législatives Analamanga", dates: "20 juin 2025", status: "soon", participation: null, daysLeft: 54 },
    { id: 3, name: "Municipales Toamasina", dates: "3 mars 2025", status: "done", participation: 58 },
    { id: 4, name: "Référendum constitutionnel", dates: "À planifier", status: "draft", participation: null },
]

const activity = [
    { user: "Rakoto A.", action: "Vote enregistré", date: "13 mai 09:42", election: "Présidentielle", status: "valid" },
    { user: "Rabe M.", action: "Inscription modifiée", date: "13 mai 09:31", election: "Législatives", status: "pending" },
    { user: "Rasoa F.", action: "Vote enregistré", date: "13 mai 09:18", election: "Présidentielle", status: "valid" },
    { user: "Admin sys", action: "Bureau ajouté", date: "13 mai 08:55", election: "Municipales", status: "valid" },
    { user: "Randria T.", action: "Ticket signalé", date: "13 mai 08:40", election: "Présidentielle", status: "urgent" },
]

const statusBadge = (s: string) => {
    const map: Record<string, string> = {
        live: "bg-[#F9423A] text-white",
        soon: "bg-amber-50 text-amber-800 border border-amber-200",
        done: "bg-green-50 text-[#00843D] border border-green-200",
        draft: "bg-gray-100 text-gray-500 border border-gray-200",
    }
    const label: Record<string, string> = { live: "Direct", soon: "Bientôt", done: "Terminée", draft: "Brouillon" }
    return <span className={`text-xs px-2 py-0.5 rounded-full ${map[s]}`}>{label[s]}</span>
}

const activityBadge = (s: string) => {
    const map: Record<string, string> = {
        valid: "bg-green-50 text-[#00843D]",
        pending: "bg-amber-50 text-amber-700",
        urgent: "bg-red-50 text-[#F9423A]",
    }
    const label: Record<string, string> = { valid: "Validé", pending: "En attente", urgent: "Urgent" }
    return <span className={`text-xs px-2 py-0.5 rounded-full ${map[s]}`}>{label[s]}</span>
}

const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profil", href: "/profile" },
    { label: "Liste des élections", href: "/elections" },
    { label: "Analytique", href: "/analytics" },
    { label: "Monitoring", href: "/monitoring" },
    { label: "Paramètres", href: "/settings" },
]

const chartData = {
    labels: ["Analamanga", "Atsinanana", "Boeny", "Diana", "H. Matsiatra"],
    datasets: [
        {
            type: "bar" as const,
            label: "Participation",
            data: [71, 58, 62, 55, 67],
            backgroundColor: "#00843D",
            borderRadius: 4,
        },
        {
            type: "line" as const,
            label: "Objectif",
            data: [70, 70, 70, 70, 70],
            borderColor: "#F9423A",
            borderWidth: 1.5,
            borderDash: [4, 3],
            pointRadius: 0,
            fill: false,
        },
    ],
}

const Dashboard = () => {
    const { username } = AuthUseProvider()
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-screen bg-gray-50">

           
            <nav className="h-[52px] bg-[#F9423A] flex items-center justify-between px-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                
                    <div className="flex items-center gap-0.5">
                        <div className="w-1 h-5 bg-white rounded-sm" />
                        <div className="flex flex-col w-2 h-5 rounded-sm overflow-hidden">
                            <div className="flex-1 bg-[#F9423A]" />
                            <div className="flex-1 bg-[#00843D]" />
                        </div>
                    </div>
                    <div>
                        <span className="text-white font-medium text-sm">Fidio Admin</span>
                        <p className="text-white/60 text-[10px] leading-none">Plateforme électorale</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-white/80 text-xs">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Direct actif
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">
                        {username?.slice(0, 2).toUpperCase() ?? "AD"}
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">

            
                <aside className="w-[200px] bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto">
                    <div className="pt-3">
                        <p className="px-4 pb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Principal</p>
                        {navItems.slice(0, 2).map(item => (
                            <div key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center px-4 py-2.5 text-sm cursor-pointer border-l-2 transition-colors
                                    ${pathname === item.href
                                        ? "border-[#00843D] text-[#00843D] bg-green-50"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"}`}>
                                {item.label}
                            </div>
                        ))}
                        <p className="px-4 pt-3 pb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Élections</p>
                        {navItems.slice(2, 5).map(item => (
                            <div key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center px-4 py-2.5 text-sm cursor-pointer border-l-2 transition-colors
                                    ${pathname === item.href
                                        ? "border-[#00843D] text-[#00843D] bg-green-50"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"}`}>
                                {item.label}
                            </div>
                        ))}
                        <p className="px-4 pt-3 pb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wide">Système</p>
                        {navItems.slice(5).map(item => (
                            <div key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center px-4 py-2.5 text-sm cursor-pointer border-l-2 transition-colors
                                    ${pathname === item.href
                                        ? "border-[#00843D] text-[#00843D] bg-green-50"
                                        : "border-transparent text-gray-500 hover:bg-gray-50"}`}>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </aside>

            
                <main className="flex-1 overflow-y-auto p-4 space-y-4">

                    
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "Électeurs inscrits", value: "4 821", sub: "depuis janvier", pct: 72, color: "#00843D", badge: "+3.2%", bdg: "green" },
                            { label: "Votes enregistrés", value: "18 340", sub: "ce cycle", pct: 58, color: "#00843D", badge: "+18%", bdg: "green" },
                            { label: "Tickets ouverts", value: "37", sub: "3 urgents", pct: 37, color: "#F9423A", badge: "+5", bdg: "red" },
                            { label: "Participation moy.", value: "64%", sub: "objectif 70%", pct: 64, color: "#BA7517", badge: "stable", bdg: "amber" },
                        ].map(m => (
                            <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-gray-500">{m.label}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full
                                        ${m.bdg === "green" ? "bg-green-50 text-green-700" :
                                          m.bdg === "red" ? "bg-red-50 text-[#F9423A]" : "bg-amber-50 text-amber-700"}`}>
                                        {m.badge}
                                    </span>
                                </div>
                                <div className="text-xl font-medium text-gray-900">{m.value}</div>
                                <div className="text-[10px] text-gray-400 mb-2">{m.sub}</div>
                                <div className="h-1 rounded-full bg-gray-100">
                                    <div className="h-1 rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                                </div>
                            </div>
                        ))}
                    </div>

                  
                    <div className="grid grid-cols-2 gap-4">

                       
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-800">Élections actives</h2>
                                    <p className="text-xs text-gray-400">statut en temps réel</p>
                                </div>
                                <span className="text-xs bg-[#F9423A] text-white px-2 py-0.5 rounded-full">4 en direct</span>
                            </div>
                            <div className="space-y-2">
                                {elections.map(e => (
                                    <div key={e.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0
                                                ${e.status === "live" ? "bg-[#F9423A]" :
                                                  e.status === "soon" ? "bg-amber-400" :
                                                  e.status === "done" ? "bg-[#00843D]" : "bg-gray-300"}`} />
                                            <div>
                                                <div className="text-xs font-medium text-gray-800">{e.name}</div>
                                                <div className="text-[10px] text-gray-400">{e.dates}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {statusBadge(e.status)}
                                            {e.participation !== null && (
                                                <span className="text-xs font-medium text-gray-500">{e.participation}%</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                     
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                            <div className="mb-3">
                                <h2 className="text-sm font-medium text-gray-800">Participation par région</h2>
                                <p className="text-xs text-gray-400">cycle actuel</p>
                            </div>
                            <div className="h-44">
                                <Bar data={chartData as any} options={{
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                                        y: { min: 0, max: 100, ticks: { callback: (v: string) => v + "%", stepSize: 25, font: { size: 10 } }, grid: { color: "rgba(0,0,0,0.05)" } }
                                    }
                                }} />
                            </div>
                            <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#00843D]" />Participation</span>
                                <span className="flex items-center gap-1"><span className="w-4 h-0 border-t border-dashed border-[#F9423A]" />Objectif 70%</span>
                            </div>
                        </div>
                    </div>

                   
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-medium text-gray-800">Activité récente</h2>
                                <p className="text-xs text-gray-400">dernières actions enregistrées</p>
                            </div>
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left font-medium text-gray-400 pb-2 w-1/5">Utilisateur</th>
                                    <th className="text-left font-medium text-gray-400 pb-2 w-1/4">Action</th>
                                    <th className="text-left font-medium text-gray-400 pb-2 w-1/5">Date</th>
                                    <th className="text-left font-medium text-gray-400 pb-2 w-1/5">Élection</th>
                                    <th className="text-left font-medium text-gray-400 pb-2">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activity.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0">
                                        <td className="py-2 font-medium text-gray-800">{row.user}</td>
                                        <td className="py-2 text-gray-500">{row.action}</td>
                                        <td className="py-2 text-gray-500">{row.date}</td>
                                        <td className="py-2 text-gray-500">{row.election}</td>
                                        <td className="py-2">{activityBadge(row.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    )
}

export default Dashboard