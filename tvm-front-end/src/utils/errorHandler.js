/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * requests while talking to the AI.
 * @param {*} error - the given exception error in the catch
 * @returns a status and message
 */
export function RequestError(error) {
    if (error) {
        if (error.status === 500) {
            return {
                current_state: error.status,
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

/**
 * This function is a short hand error overview,
 * containing all the error status code that respond
 * to codes in the back-end. Will show a corresponding message,
 * depending on the given status code.
 * Will show a default message once the error status code
 * isn't present inside of the switch.
 * @param {*} error - the given exception error in the catch
 * @returns a corresponding message
 */
export function ErrorHandler(error) {
    if (error) {
        switch (error.status) {
            case 400:
                return {
                    current_state: error.status,
                    message: error.response.data.detail,
                };
            case 403:
                return {
                    current_state: error.status,
                    message: error.response.data.detail,
                };
            case 404:
                return {
                    current_state: error.status,
                    message: error.response.data.detail,
                };
            case 500:
                return {
                    current_state: error.status,
                    message: error.response.data.detail,
                };
            default:
                return {
                    current_state: null,
                    message: "Er trad een onbekende fout op",
                };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}
