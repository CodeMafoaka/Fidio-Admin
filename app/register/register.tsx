"use client";

import { useState } from "react"
import { RegisterAuthUseProvider, RegisterUseProvider } from "../Context/RegisterAuth"
import { useRouter } from "next/navigation"


const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [confirmedPass, setConfirmedPass] = useState("")
    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [cin, setCin] = useState("")
    const [telephone, setTelephone] = useState("")
    const routeur = useRouter()
    const { registerUser } = RegisterAuthUseProvider()

    const handleRegister = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (password !== confirmedPass) {
            setMessage("mots de passe incorrect")
            return;
        }
        
        try {
            const endpoint = "http://localhost:8080/api/register";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    nom, 
                    prenom, 
                    cin, 
                    telephone 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || "Registration failed");
                return;
            }

            registerUser(data.username, data.token);

            setTimeout(() => routeur.push("/accueil"), 800);
        } catch (error) {
            console.error(error);
            setMessage("Erreur serveur");
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
                    
                    <label htmlFor="">cin</label>
                    <input type="text" onChange={(e)=> {
                        setCin(e.target.value)
                    }} />
                    
                    <label htmlFor="">telephone</label>
                    <input type="text" onChange={(e)=> {
                        setTelephone(e.target.value)
                    }} />
                    
                    <label htmlFor="">username</label>
                    <input type="text" onChange={(e)=> {
                        setUsername(e.target.value)
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
                
                {message && <p>{message}</p>}
                
                <button type="submit">register</button>
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
