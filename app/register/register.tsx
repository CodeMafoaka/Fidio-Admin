"use client";

import { useState } from "react"
import { RegisterAuthUseProvider, RegisterUseProvider } from "../Context/RegisterAuth"
import { useRouter } from "next/navigation"


const Register = () => {
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [confirmedPass, setConfirmedPass] = useState("")
    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [cin, setCin] = useState("")
    const routeur = useRouter()
    const { registerAdmin, isLoading, error, clearError } = RegisterAuthUseProvider()

    const handleRegister = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        clearError();
        
        if (password !== confirmedPass) {
            setMessage("mots de passe incorrect")
            return;
        }
        
        if (!nom || !prenom || !cin || !password) {
            setMessage("Tous les champs sont obligatoires")
            return;
        }
        
        try {
            const userData = {
                firstName: prenom,
                lastName: nom,
                gid: cin,
                password: password
            };
            
            await registerAdmin(userData);
            setMessage("Administrateur enregistré avec succès!");
            
            setTimeout(() => routeur.push("/login"), 2000);
        } catch (error) {
            console.error(error);
            setMessage(error instanceof Error ? error.message : "Erreur serveur");
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleRegister}>
                <div>
                    <h1>register</h1>
                </div>
                <div>
                    <label htmlFor="">nom</label>
                    <input type="text" onChange={(e)=> {
                        setNom(e.target.value)
                    }} />
                    
                    <label htmlFor="">prenom</label>
                    <input type="text" onChange={(e)=> {
                        setPrenom(e.target.value)
                    }} />
                    
                    <label htmlFor="">cin (GID)</label>
                    <input type="text" onChange={(e)=> {
                        setCin(e.target.value)
                    }} />
                    
                    <label htmlFor="">entrer mots de passe</label>
                    <input type="password" onChange={(e)=> {
                        setPassword(e.target.value)
                    }} />
                    
                    <label htmlFor="">verifier mot de passe </label>
                    <input type="password" onChange={(e)=> {
                        setConfirmedPass(e.target.value)
                    }} />
                </div>
                
                {(message || error) && (
                    <p style={{ color: message.includes('succès') ? 'green' : 'red' }}>
                        {message || error}
                    </p>
                )}
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Enregistrement...' : 'register'}
                </button>
            </form>
        </div>
    )
}

const RegisterWithProvider = () => {
    return (
        <RegisterUseProvider>
            <Register />
        </RegisterUseProvider>
    )
}

export default RegisterWithProvider;
