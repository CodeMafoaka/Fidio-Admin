
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
        e.preventDefault();
        if (password !== confirmedPass) {
            setMessage("mots de passe incorrect")
        }
        try {
            const endpoint = "http://localhost:8080/api/login";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || "Login failed");
                return;
            }

            loginUser(data.username, data.token);


            setTimeout(() => routeur.push("/accueil"), 800);
        } catch (error) {
            console.error(error);
            setMessage("Erreur serveur");
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleLogin}>
                <div>
                    <h1>login</h1>
                </div>
                <div>
                    <label htmlFor="">username</label>
                    <input type="text" onChange={(e)=> {
                        setUsername(e.target.value)
                    }} />
                      <label htmlFor="">entrer mots de passe</label>
                    <input type="password" onChange={(e)=> {
                        setPassword(e.target.value)
                    }} />
                      <label htmlFor="">verifier mot de passe </label>
                    <input type="text" onChange={(e)=> {
                        setConfirmedPass(e.target.value)
                    }} />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login;