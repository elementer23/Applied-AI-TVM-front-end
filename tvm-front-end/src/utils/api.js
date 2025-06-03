import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Response interceptor voor token verversen bij 401
api.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        // Alleen bij 401, en niet als we al geprobeerd hebben te refreshen
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

                // **Kies HIER ÉÉN KEY, bijvoorbeeld 'access_token':**
                sessionStorage.setItem("access_token", newAccessToken);
                sessionStorage.setItem("refresh_token", newRefreshToken);

                // Pas de Authorization header van het originele request aan
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // Probeer opnieuw met nieuwe token
                return api(originalRequest);
            } catch (err) {
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("refresh_token");
                window.location.href = "/";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

// Request interceptor: altijd Authorization header meesturen als token aanwezig is
api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("access_token"); // Gebruik hier dezelfde key als hierboven

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
