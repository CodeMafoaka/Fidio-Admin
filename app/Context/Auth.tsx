"use client"
import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextType {
    token: string;
    username: string;
    loginUser: (username: string, token: string) => void;
    authUser: (username: string, token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const UseProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""
    );
    const [username, setUsername] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("username") ?? "" : ""
    );

    const loginUser = (username: string, token: string) => {
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        setUsername(username);
        setToken(token);
    };

    const authUser = (username: string, token: string) => {
        setUsername(username);
        setToken(token);
    };

    return (
        <AuthContext.Provider value={{ loginUser, authUser, token, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthUseProvider = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthUseProvider must be used inside UseProvider");
    return context;
};