"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface RegisterAuthContextType {
    token: string;
    username: string;
    registerUser: (username: string, token: string) => void;
    authRegisterUser: (username: string, token: string) => void;
}

const RegisterAuthContext = createContext<RegisterAuthContextType | null>(null);

export const RegisterUseProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem("register_token") || "" : "");
    const [username, setUsername] = useState(typeof window !== 'undefined' ? localStorage.getItem("register_username") || "" : "");

    const registerUser = (username: string, token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("register_username", username);
            localStorage.setItem("register_token", token);
        }
        setUsername(username);
        setToken(token);
    };

    const authRegisterUser = (username: string, token: string) => {
        setUsername(username);
        setToken(token);
    };

    return (
        <RegisterAuthContext.Provider value={{ registerUser, authRegisterUser, token, username }}>
            {children}
        </RegisterAuthContext.Provider>
    );
};

export const RegisterAuthUseProvider = () => {
    const context = useContext(RegisterAuthContext);
    if (!context) throw new Error("RegisterAuthUseProvider must be used inside RegisterUseProvider");
    return context;
};
