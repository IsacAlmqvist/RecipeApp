import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function Login ({ onGuestLogin }) {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch(err) {
            setError("fel inlogg :( ", err)
        }
    } 

    return (
        <div style ={{maxWidth: "300px", margin: "2rem auto", textAlign: "center"}}>
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
                <input 
                    className="form-control mt-4"
                    type="email"
                    value={email}
                    required
                    placeholder="Epost"
                    onChange={(e) => setEmail(e.target.value)}    
                />
                <input 
                    className="form-control my-2"
                    type="password"
                    value={password}
                    required
                    placeholder="Lösenord"
                    onChange={(e) => setPassword(e.target.value)}    
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit" className="btn btn-primary my-2">
                    Logga in
                </button>
            </form>

            <div>eller</div>

            <button onClick={onGuestLogin} className="btn btn-outline-secondary my-2">
                Testa som gäst
            </button>
        </div>
    );
}