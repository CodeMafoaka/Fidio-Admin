"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthUseProvider } from "@/app/Context/Auth"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { token } = AuthUseProvider()
    const router = useRouter()

    useEffect(() => {
        if (!token) {
            router.replace("/login")
        }
    }, [token, router])

   if (!token) return null

    return <>{children}</>
}