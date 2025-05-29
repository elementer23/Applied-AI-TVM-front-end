import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

//calling the interceptor from axios, which checks
//on any changes that have happened during the call off an endpoint.
//will intercept changes in the call based upon tokens.
//Will also naturally handle refreshes on the front-end, for tokens.
api.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = sessionStorage.getItem("refresh_token");

            if (!refreshToken) {
                window.location.href = "/";
                return Promise.reject(error);
            }

            try {
                const currentResponse = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/token/refresh`,
                    {
                        refresh_token: refreshToken,
                    }
                );

                const newAccessToken = currentResponse.data.access_token;
                const newRefreshToken = currentResponse.data.refresh_token;

                sessionStorage.setItem("token", newAccessToken);
                sessionStorage.setItem("refresh_token", newRefreshToken);

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("refresh_token");
                window.location.href = "/";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function loginUser(username, password) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    const response = await api.post("/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
}

export async function refreshAccessToken(refreshToken) {
    const response = await api.post("/token/refresh", {
        refresh_token: refreshToken,
    });
    return response.data;
}

export async function revokeRefreshToken(refreshToken) {
    const response = await api.post("/token/revoke", {
        refresh_token: refreshToken,
    });
    return response.data;
}

export async function logout() {
    const response = await api.post("/logout", {});
    return response.data;
}

export async function createUser({ username, password, role = "user" }) {
    const response = await api.post(
        "/users/",
        null,
        {
            params: { username, password, role },
        }
    );
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/me");
    return response.data;
}

export async function verifyToken(token) {
    const response = await api.get(`/verify-token/${token}`);
    return response.data;
}

export async function getConversations() {
    const response = await api.get("/conversations");
    return response.data;
}

export async function createConversation(data) {
    // TODO: Vul 'data' aan zodra de backend structuur duidelijk is.
    const response = await api.post("/conversations", data);
    return response.data;
}

export async function deleteConversation(conversationId) {
    const response = await api.delete(`/conversations/${conversationId}`);
    return response.data;
}

export async function runCrew(input) {
    const response = await api.post("/run", { input });
    return response.data;
}

export default api;