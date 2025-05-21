import React, { useState } from "react";
import "../LoginScreen.css";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just call onLogin (no real auth)
    onLogin();
  };

  return (
    <div className="login-screen-container">
        <div className="login-screen-header">
            <img className='image-header' src="/images/tvmLogo.png" alt="Logo" />
            <img className='profile-header' src="/images/TVM_profile.png" alt="Profile" />
        </div>
      <div className="login-screen-content">
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <div>
            <input
                type="text"
                placeholder="Gebruikersnaam"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            </div>
            <div>
            <input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            </div>
            
            <button type="submit">
                Inloggen
            </button>
        </form>
        </div>
    </div>
  );
}

export default LoginScreen;
