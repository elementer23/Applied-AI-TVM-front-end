import api from "./api";

/**
 * Verstuurt input naar de backend en haalt AI-antwoord op
 * @param {*} requestedInput
 * @returns string (advies)
 */
export async function Request(requestedInput) {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.post(
            "/run",
            { input: requestedInput },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.output;
    } catch (error) {
        console.error("Fout bij request:", error);
        return "Er is iets misgegaan...";
    }
}

/**
 * Login via /token endpoint van FastAPI backend
 * Slaat de access_token op in sessionStorage en navigeert naar /main
 * @param {*} requested_data (username + password)
 * @param {*} navigate (router functie)
 */
export async function Login(requested_data, navigate) {
    const form = new URLSearchParams();
    form.append("username", requested_data.username);
    form.append("password", requested_data.password);

    try {
        const response = await api.post("/token", form, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (response.status === 200) {
            sessionStorage.setItem("token", response.data.access_token);
            navigate("/main");
        } else {
            console.error(response.status + " Authentication failed!");
        }
    } catch (error) {
        console.error("Error in Login: " + error.message);
        alert("Login mislukt. Controleer gebruikersnaam of wachtwoord.");
    }
}

/**
 * Logout: verwijdert tokens en navigeert terug naar login
 * @param {*} navigate
 */
export async function Logout(navigate) {
    // eventueel: backend aanroepen als je een endpoint hebt dat token ongeldig maakt
    // const response = await api.post("/logout");

    sessionStorage.removeItem("token");
    navigate("/");
}
