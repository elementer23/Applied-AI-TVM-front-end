import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.response.use(
    (response) => response,
    async function (error) {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

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

                localStorage.setItem("token", newAccessToken);
                localStorage.setItem("refresh_token", newRefreshToken);

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
