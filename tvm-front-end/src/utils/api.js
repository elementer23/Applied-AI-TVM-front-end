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

        if (error.status === 401 && !originalRequest._retry) {
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

//request intercept to check whether authorization is allowed, based on the token
api.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
