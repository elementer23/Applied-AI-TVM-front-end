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

export function RegisterError(error) {
    if (error.response) {
        if (error.response?.status === 400) {
            return {
                current_state: error.response.status,
                message: "Username already registered!",
            };
        } else if (error.response?.status === 403) {
            return {
                current_state: error.response.status,
                message: "Insufficient account level!",
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

export function RequestError(error) {
    if (error.response) {
        if (error.response?.status === 500) {
            return {
                current_state: error.response.status,
                message:
                    "Something went wrong during the retrieval of the answer",
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}
