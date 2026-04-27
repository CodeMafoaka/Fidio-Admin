"use client"
import { useState } from "react"
import { AuthUseProvider } from "../Context/Auth"
import { useRouter } from "next/navigation"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [confirmedPass, setConfirmedPass] = useState("")
    const routeur = useRouter()
    const { loginUser } = AuthUseProvider()

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (password !== confirmedPass) {
            setMessage("Mots de passe incorrects")
            return
        }
        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            const data = await response.json()
            if (!response.ok) {
                setMessage(data.error || "Échec de connexion")
                return
            }
            loginUser(data.username, data.token)
            setTimeout(() => routeur.push("/page/dashboard"), 800)
        } catch (error) {
            console.error(error)
            setMessage("Erreur serveur")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-xl overflow-hidden shadow-sm border border-gray-200">

                <div className="bg-[#F9423A] px-7 py-5 flex items-center gap-3">
            
                    <div className="flex items-center gap-1 mr-1">
                        <div className="w-1.5 h-10 bg-white rounded-sm" />
                        <div className="w-2.5 h-10 rounded-sm overflow-hidden flex flex-col">
                            <div className="flex-1 bg-[#F9423A]" />
                            <div className="flex-1 bg-[#00843D]" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-medium text-white">Connexion</h1>
                        <p className="text-sm text-white/75">Entrez vos identifiants</p>
                    </div>
                </div>

                <div className="bg-white px-7 py-6 flex flex-col gap-4">

                    {message && (
                        <p className="text-sm text-[#F9423A] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {message}
                        </p>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-500">
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            placeholder="ex : jean.rakoto"
                            className="h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 outline-none
                                       focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/15 transition"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-500">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 outline-none
                                       focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/15 transition"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-500">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 outline-none
                                       focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/15 transition"
                            onChange={(e) => setConfirmedPass(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleLogin}
                        className="mt-1 h-11 bg-[#00843D] hover:bg-[#007E3A] active:scale-[0.98]
                                   text-white font-medium text-sm rounded-lg transition-all"
                    >
                        Se connecter
                    </button>
                </div>

              
                <div className="bg-white border-t border-gray-100 px-7 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-200" />
                        <div className="w-2 h-2 rounded-full bg-[#F9423A]" />
                        <div className="w-2 h-2 rounded-full bg-[#00843D]" />
                    </div>
                    <span className="text-xs text-gray-400">Portail sécurisé</span>
                </div>
            </div>
        </div>
    )
}

export default Login