"use client";

import { createContext, useState, ReactNode, useContext } from "react";
import { authService, CreateCitizen, Citizen } from "@/lib/api/auth";

interface RegisterAuthContextType {
    token: string;
    username: string;
    user: Citizen | null;
    isLoading: boolean;
    error: string | null;
    registerUser: (username: string, token: string) => void;
    authRegisterUser: (username: string, token: string) => void;
    registerAdmin: (userData: CreateCitizen) => Promise<void>;
    clearError: () => void;
}

const RegisterAuthContext = createContext<RegisterAuthContextType | null>(null);

export const RegisterUseProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem("register_token") || "" : "");
    const [username, setUsername] = useState(typeof window !== 'undefined' ? localStorage.getItem("register_username") || "" : "");
    const [user, setUser] = useState<Citizen | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const registerAdmin = async (userData: CreateCitizen) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const registeredUser = await authService.register(userData);
            setUser(registeredUser);
            setUsername(registeredUser.firstName);
            
            // Store token if returned by API, otherwise use a default
            if (typeof window !== 'undefined') {
                localStorage.setItem("register_username", registeredUser.firstName);
                // Note: API doesn't return token on registration, you might need to login separately
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <RegisterAuthContext.Provider value={{ 
            registerUser, 
            authRegisterUser, 
            registerAdmin,
            clearError,
            token, 
            username, 
            user,
            isLoading,
            error
        }}>
            {children}
        </RegisterAuthContext.Provider>
    );
};

export const RegisterAuthUseProvider = () => {
    const context = useContext(RegisterAuthContext);
    if (!context) throw new Error("RegisterAuthUseProvider must be used inside RegisterUseProvider");
    return context;
};
