export function LoginError(error) {
    if (error.response) {
        if (error.response?.status === 400) {
            return {
                current_state: error.response.status,
                message: "Incorrect username or password!",
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}
