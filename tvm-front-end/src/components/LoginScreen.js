import React, { useState } from "react";
import { Login } from "../utils/Services";
import "../css/LoginScreen.css";
import "../css/Error.css";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
    const [request, setRequest] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleInput = (event) => {
        setRequest({ ...request, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const out = await Login(request, navigate);
        if (!out.success) {
            setError(out.message);
        }
    };

    return (
        <div className="login-screen-container">
            <div className="login-screen-header">
                <img
                    className="image-header"
                    src="/images/tvmLogo.png"
                    alt="Logo"
                />
                <img
                    className="profile-header"
                    src="/images/TVM_profile.png"
                    alt="Profile"
                />
            </div>
            {error && <div className="errorComponent">{error}</div>}
            <div className="login-screen-content">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>Login</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Gebruikersnaam"
                            onChange={handleInput}
                            name="username"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Wachtwoord"
                            onChange={handleInput}
                            name="password"
                            required
                        />
                    </div>

                    <button type="submit">Inloggen</button>
                </form>
            </div>
        </div>
    );
}

export default LoginScreen;
