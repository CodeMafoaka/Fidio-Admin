"use client"
import { useRouter, usePathname } from "next/navigation"
import { AuthUseProvider } from "../app/Context/Auth"
import { useState } from "react"

const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profil", href: "/profile" },
    { label: "Liste des élections", href: "/elections" },
    { label: "Liste des candidats", href: "/candidates" },
    { label: "Monitoring", href: "/monitoring" },
    { label: "Paramètres", href: "/settings" },
]

const listItems = [
    { label: "Élections", href: "/elections" },
    { label: "Candidats", href: "/candidates" },
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { username } = AuthUseProvider()
    const router = useRouter()
    const pathname = usePathname()

    const [listOpen, setListOpen] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)       // ← nouveau
    const [confirmLogout, setConfirmLogout] = useState(false) // ← nouveau

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

                    {/* Avatar avec dropdown — modifié ici uniquement */}
                    <div
                        className="relative"
                        onClick={() => setAvatarOpen(!avatarOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium cursor-pointer">
                            {username?.slice(0, 2).toUpperCase() ?? "AD"}
                        </div>

                        {avatarOpen && (
                            
                            <div className="fixed right-100 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 ">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-[#F9423A] flex items-center justify-center text-white text-xs font-medium mb-2">
                                        {username?.slice(0, 2).toUpperCase() ?? "AD"}
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{username ?? "Administrateur"}</p>
                                    <p className="text-[11px] text-gray-400">Super Admin</p>
                                </div>
                                <div className="px-3 py-2">
                                    <button
                                        onClick={() => { setAvatarOpen(false); setConfirmLogout(true) }}
                                        className="w-full text-left text-sm text-[#F9423A] px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal confirmation déconnexion — nouveau */}
            {confirmLogout && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80">
                        <p className="text-sm font-medium text-gray-800 mb-1">Déconnexion</p>
                        <p className="text-xs text-gray-400 mb-5">Voulez-vous vraiment vous déconnecter ?</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setConfirmLogout(false)}
                                className="text-xs px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmLogout(false)
                                    router.push("/login") // ← adaptez à votre route de logout
                                }}
                                className="text-xs px-4 py-2 bg-[#F9423A] text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <div
                            className="relative"
                            onMouseEnter={() => setListOpen(true)}
                            onMouseLeave={() => setListOpen(false)}
                        >
                            <div className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-default border-l-2 transition-colors
                                ${pathname.startsWith("/elections") || pathname.startsWith("/candidates")
                                    ? "border-[#00843D] text-[#00843D] bg-green-50"
                                    : "border-transparent text-gray-500 hover:bg-gray-50"}`}>
                                <span>Listes</span>
                                <span className="text-[10px] text-gray-400">›</span>
                            </div>
                            {listOpen && (
                                <div className="absolute left-full top-0 ml-1 w-44 bg-white border border-gray-100 rounded-lg shadow-md z-50 overflow-hidden">
                                    {listItems.map(item => (
                                        <div
                                            key={item.href}
                                            onClick={() => router.push(item.href)}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                                                ${pathname.startsWith(item.href)
                                                    ? "text-[#00843D] bg-green-50"
                                                    : "text-gray-600 hover:bg-gray-50"}`}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {navItems.slice(4, 5).map(item => (
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
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}