"use client"
import { useState } from "react"
import { AuthUseProvider } from "../Context/Auth"
import { useRouter } from "next/navigation"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
    const [gid, setGid] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const routeur = useRouter()
    const { loginUser } = AuthUseProvider()


    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (!gid || !password) {
            setMessage("Champ vide ! ")
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({gid: gid, password:password }),
            })
          
            if (!response.ok) {
                const text = await response.text() 
                console.error("Server error response:", text)
                setMessage(`Échec de connexion (${response.status})`)
                return
            }

            const data = await response.json()
            loginUser( data.token)
            setTimeout(() => routeur.push("/dashboard"), 800)

        } catch (error) {
            console.error(error)
            setMessage("Erreur serveur")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form onSubmit={handleLogin} className="w-full max-w-md rounded-xl overflow-hidden shadow-sm border border-gray-200">

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

                    <div className="flex flex-col gap-1.5 text-black">
                        <label className="text-sm font-medium  ">
                            CIN
                        </label>
                        <input
                            type="text"
                            placeholder="CIN"
                            className="h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 outline-none
                                       focus:border-[#00843D] focus:ring-2 focus:ring-[#00843D]/15 transition"
                            onChange={(e) => setGid(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 text-black">
                        <label className="text-sm font-medium">
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


                    <button
                        type="submit"
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
            </form>
        </div>
    )
}

export default Login