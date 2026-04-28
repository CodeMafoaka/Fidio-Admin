"use client"
import { Days_One } from "next/font/google";
import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextType {
    token: string;
    loginUser: (token: string) => void;
    authUser: (token: string) => void;
    logout: () => void,
    getMe : () => void, 
    firstName : string,
    lastName : string,
    gid: string,
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const AuthContext = createContext<AuthContextType | null>(null);

export const UseProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""
    );

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gid, setGid] = useState("");

    const getMe = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setFirstName(data.firstName)
            setLastName(data.lastName)
            setGid(data.gid)
        } catch (error) {
            console.log(error);

        }
    }

    const loginUser = (token: string) => {

        localStorage.setItem("token", token);

        setToken(token);
    };

    const authUser = (token: string) => {
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token')
        setToken("")
    }
    return (
        <AuthContext.Provider value={{ loginUser, authUser, token, logout , getMe , firstName , lastName , gid }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthUseProvider = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthUseProvider must be used inside UseProvider");
    return context;
};