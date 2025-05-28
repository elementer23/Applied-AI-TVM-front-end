import { useState } from "react";
import Header from "./Header";
import "../css/LoginScreen.css";
import { RegisterUser } from "../utils/Services";
import "../css/Error.css";

function AccountManager() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            username: event.target.username.value,
            password: event.target.password.value,
        };

        const out = await RegisterUser(formData);

        if (!out.success) {
            setError(out.message);
        } else {
            setSuccess("You successfully created a new account");
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
                        {message && (
                            <p style={{ marginTop: "1rem" }}>{message}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AccountManager;
