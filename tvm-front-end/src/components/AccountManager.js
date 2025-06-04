import { useState } from "react";
import Header from "./Header";
import "../css/LoginScreen.css";
import { RegisterUser } from "../utils/Services";
import "../css/Error.css";

function AccountManager() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user"
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const out = await RegisterUser(formData);
            if (!out.success) {
                setError(out.message || "Er ging iets mis");
                setSuccess(null);
            } else {
                setSuccess("Account succesvol aangemaakt!");
                setError(null);
                setFormData({ username: "", password: "", role: "user" });
            }
        } catch (err) {
            setError("Netwerkfout of server niet bereikbaar.");
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-manager-container">
            <div className="section right-section">
                <Header />
                {error && <div className="errorComponent">{error}</div>}
                {success && <div className="successComponent">{success}</div>}
                <div className="account-section">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h1>Account aanmaken</h1>
                        <div>
                            <label htmlFor="username">Gebruikersnaam:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                required
                                autoComplete="username"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Wachtwoord:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                required
                                autoComplete="new-password"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="role">Rol:</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Bezig..." : "Account aanmaken"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountManager;
