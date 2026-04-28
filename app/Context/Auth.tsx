"use client"
import { createContext, useState, ReactNode, useContext, useEffect } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface AuthContextType {
    token: string
    ready: boolean
    firstName: string
    lastName: string
    gid: string
    loginUser: (token: string) => void
    logout: () => void
    getMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)


function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        if (!payload.exp) return false
        return payload.exp < Math.floor(Date.now() / 1000)
    } catch {
        return true
    }
}

export const UseProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState("")
    const [ready, setReady] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gid, setGid] = useState("")

    useEffect(() => {
        const stored = localStorage.getItem("token") ?? ""

        
        if (stored && isTokenExpired(stored)) {
            console.warn("Token expiré, nettoyage automatique")
            localStorage.removeItem("token")
            setToken("")
        } else {
            setToken(stored)
        }

        setReady(true)
    }, [])

    const getMe = async () => {
        const t = localStorage.getItem("token") ?? ""
        if (!t || isTokenExpired(t)) {
            localStorage.removeItem("token")
            setToken("")
            return
        }
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${t}`,
                },
            })
            if (!res.ok) return
            const data = await res.json()
            setFirstName(data.firstName ?? "")
            setLastName(data.lastName ?? "")
            setGid(data.gid ?? "")
        } catch (e) {
            console.error("getMe:", e)
        }
    }

    const loginUser = (t: string) => {
        localStorage.setItem("token", t)
        setToken(t)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken("")
        setFirstName("")
        setLastName("")
        setGid("")
    }

    return (
        <AuthContext.Provider value={{ token, ready, firstName, lastName, gid, loginUser, logout, getMe }}>
            {children}
        </AuthContext.Provider>
    )
}

export const AuthUseProvider = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("AuthUseProvider must be used inside UseProvider")
    return ctx
}
