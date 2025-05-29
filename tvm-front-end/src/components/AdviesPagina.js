import React, { useState } from "react";
import { loginUser, getAdvies } from "./ApiCalls";
import "./AdviesPagina.css";
import { useNavigate } from "react-router-dom";

const AdviesPagina = () => {
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      setLoggedIn(true);
      setError("");
    } catch (err) {
      setError("Inloggen mislukt: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleAdvies = async () => {
    try {
      const result = await getAdvies(input);
      setOutput(result);
      setError("");
    } catch (err) {
      setError("Fout bij ophalen advies: " + (err.response?.data?.detail || err.message));
      setOutput("");
    }
  };

  return (
    <div className="advies-container">
      <button
        onClick={() => navigate("/")}
        className="terug-knop"
      >
        ← Terug naar startpagina
      </button>

      <header className="advies-header">
        <h1>TVM Advies Generator</h1>
        <p>Vraag hier eenvoudig je advies op.</p>
      </header>

      {!loggedIn ? (
        <section className="advies-form">
          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Inloggen</button>
        </section>
      ) : (
        <section className="advies-form">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Typ je situatie of vraag hier..."
          />
          <button onClick={handleAdvies}>Verstuur</button>
        </section>
      )}

      {loggedIn && (
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            setLoggedIn(false);
          }}
          className="uitlog-knop"
        >
          Uitloggen
        </button>
      )}

      {output && (
        <div className="advies-result succes">
          <h2>Advies</h2>
          <p>{output}</p>
        </div>
      )}

      {error && (
        <div className="advies-result fout">
          <h2>Foutmelding</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdviesPagina;
