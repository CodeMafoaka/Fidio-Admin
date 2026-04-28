"use client"
import { useState, useEffect } from "react"
import { AuthUseProvider } from "../Context/Auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface Citizen {
    id: string
    firstName: string
    lastName: string
    gid: string
    role: "ADMIN" | "USER"
}

const roleBadge = (role: string) => {
    const map: Record<string, string> = {
        ADMIN: "bg-[#F9423A]/10 text-[#F9423A] border border-[#F9423A]/20",
        USER: "bg-green-50 text-[#00843D] border border-green-200",
    }
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${map[role] ?? "bg-gray-100 text-gray-500"}`}>
            {role}
        </span>
    )
}

export default function CitizensPage() {
    
    const { token, ready } = AuthUseProvider()

    const [citizens, setCitizens] = useState<Citizen[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
     
        if (!ready) return
        if (!token) {
            setLoading(false)
            setError("Non authentifié")
            return
        }

        const fetchCitizens = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`${BASE_URL}/citizens`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) throw new Error(`Erreur ${res.status}`)
                const data: Citizen[] = await res.json()
                setCitizens(data)
            } catch (err: any) {
                setError(err.message ?? "Erreur inconnue")
            } finally {
                setLoading(false)
            }
        }

        fetchCitizens()
    }, [ready, token]) 

    const filtered = citizens.filter(c =>
        `${c.firstName} ${c.lastName} ${c.gid}`.toLowerCase().includes(search.toLowerCase())
    )

    const totalAdmins = citizens.filter(c => c.role === "ADMIN").length
    const totalUsers = citizens.filter(c => c.role === "USER").length

    return (
        <div className="p-4 space-y-4">

         
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total citoyens", value: citizens.length, sub: "inscrits dans le système", color: "#00843D", bdg: "green", badge: "total" },
                    { label: "Administrateurs", value: totalAdmins, sub: "accès complet", color: "#F9423A", bdg: "red", badge: "admin" },
                    { label: "Utilisateurs", value: totalUsers, sub: "électeurs", color: "#00843D", bdg: "green", badge: "user" },
                ].map(m => (
                    <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500">{m.label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full
                                ${m.bdg === "green" ? "bg-green-50 text-green-700" : "bg-red-50 text-[#F9423A]"}`}>
                                {m.badge}
                            </span>
                        </div>
                        <div className="text-xl font-medium text-gray-900">
                            {loading ? "—" : m.value}
                        </div>
                        <div className="text-[10px] text-gray-400 mb-2">{m.sub}</div>
                        <div className="h-1 rounded-full bg-gray-100">
                            <div
                                className="h-1 rounded-full transition-all duration-500"
                                style={{
                                    width: citizens.length ? `${(Number(m.value) / citizens.length) * 100}%` : "0%",
                                    background: m.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

          
            <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-sm font-medium text-gray-800">Liste des citoyens</h2>
                        <p className="text-xs text-gray-400">tous les comptes enregistrés</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 w-48 outline-none focus:border-[#00843D] transition-colors"
                    />
                </div>

         
                {(!ready || loading) ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-5 h-5 rounded-full border-2 border-[#F9423A] border-t-transparent animate-spin" />
                            <span className="text-xs text-gray-400">Chargement...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
                                <span className="text-[#F9423A] text-sm font-medium">!</span>
                            </div>
                            <p className="text-xs text-gray-500">{error}</p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-xs text-gray-400">Aucun citoyen trouvé</p>
                    </div>
                ) : (
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left font-medium text-gray-400 pb-2 w-1/12">#</th>
                                <th className="text-left font-medium text-gray-400 pb-2 w-1/4">Nom complet</th>
                                <th className="text-left font-medium text-gray-400 pb-2 w-1/4">GID</th>
                                <th className="text-left font-medium text-gray-400 pb-2 w-1/4">ID</th>
                                <th className="text-left font-medium text-gray-400 pb-2">Rôle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-2 text-gray-400">{i + 1}</td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500 flex-shrink-0">
                                                {c.firstName?.slice(0, 1).toUpperCase()}{c.lastName?.slice(0, 1).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800">{c.firstName} {c.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 text-gray-500 font-mono">{c.gid}</td>
                                    <td className="py-2 text-gray-400 font-mono text-[10px] truncate max-w-[120px]">{c.id}</td>
                                    <td className="py-2">{roleBadge(c.role)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && !error && ready && (
                    <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400">
                        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
                        {search && ` pour "${search}"`}
                    </div>
                )}
            </div>
        </div>
    )
}
