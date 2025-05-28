import { useState } from "react";
import Header from "./Header";
import "../LoginScreen.css";

function AccountManager() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  const formData = {
    username: event.target.username.value,
    password: event.target.password.value,
  };

  const queryParams = new URLSearchParams({
    username: formData.username,
    password: formData.password,
    role: "user",
  });

  try {
    const response = await fetch(`http://localhost:8000/users/?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fout van backend:", errorData.detail);
      alert("Fout: " + errorData.detail);
      return;
    }

    const data = await response.json();
    console.log("Account succesvol aangemaakt:", data);
    alert("Account aangemaakt voor gebruiker: " + data.username);

  } catch (error) {
    console.error("Netwerkfout of andere fout:", error);
    alert("Er is een fout opgetreden tijdens het aanmaken van het account.");
  }
};

  return (
    <div className="account-manager-container">
        <div className="section right-section">
            <Header />
            <div className="account-section">
                <form className="login-form" onSubmit={handleSubmit}>
                  <h1>Account aanmaken</h1>
                    <div>
                        <label htmlFor="username">Gebruikersnaam:</label>
                        <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required 
                        onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Wachtwoord:</label>
                        <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Account aanmaken</button>
                    {message && <p style={{marginTop:"1rem" }}>{message}</p>}
                </form>
            </div>
        </div>
    </div>
  );
}

export default AccountManager;