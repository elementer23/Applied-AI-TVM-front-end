import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

export async function Request(question) {
    const token = localStorage.getItem("token");

    try {
        const response = await api.post(
            "/run",
            { input: question },
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
            localStorage.setItem("token", response.data.access_token);
            navigate("/main");
            return true;
        } else {
            console.error(response.status + " Authentication failed!");
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function VerifyToken() {
    const token = localStorage.getItem("token");

    try {
        const response = await api.get(`/verify-token/${token}`);
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}