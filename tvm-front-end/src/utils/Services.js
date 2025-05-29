import api from "./api";
import { LoginError, RegisterError } from "./errorHandler";

/**
 * Request function, this function expects text like input
 * and will return a proper response from the AI upon a successful attempt.
 * Will return an answer depending on the given input
 * and will return an empty string upon a failed attempt.
 * @param {*} requestedInput
 * @returns a string
 */
export async function Request(requestedInput) {
    try {
        const response = await api.post("/run", { input: requestedInput });
        //The comment from above applies to what is returned as well. If you return something through a certain name like
        //in this case "output", then it needs to be the same on the front-end as well. Or else you might send something
        //which will work, but you won't get anything in return.
        return response.data.output;
    } catch (error) {
        console.error("Fout bij request:", error);
        return "Er is iets misgegaan...";
    }
}

/**
 * Login function, makes a post request towards an endpoint in the back-end.
 * Will login or deny the login based on the given values in the requested_data.
 * Will set a new set of tokens upon successful login attempt and will set them in the session.
 * Will navigate to the main page, once the login has succeeded.
 * @param {*} requested_data
 * @param {*} navigate
 */
export async function Login(requested_data, navigate) {
    //Call the URLSearchParams function and append the given username and password from the requested_data
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
            //set the token and refresh_token upon logging in
            sessionStorage.setItem("token", response.data.access_token);
            sessionStorage.setItem("refresh_token", response.data.refresh_token);
            navigate("/main");
            return { success: true };
        } else {
            console.error(response.status + " Authentication failed!");
        }
    } catch (error) {
        console.error("Error in Login: " + error.message);
        const { current_state, message } = LoginError(error);
        return {
            success: false,
            current_state,
            message,
        };
    }
}

/**
 * This function registers a new user into the database (requires admin permissions).
 * Will add a new user upon success, will not create a new user upon failure.
 * Will return an error upon failure or a message upon success.
 * @param {*} requested_data
 * @returns data depending on the outcome
 */
export async function RegisterUser(requested_data) {
    // Form with new user credentials
    const form = new URLSearchParams();
    form.append("username", requested_data.username);
    form.append("password", requested_data.password);
    form.append("role", requested_data.role || "user");

    try {
        const response = await api.post("/users/?" + form.toString(), null);
        if (response.status === 200) {
            return { success: true };
        } else {
            console.error("Iets ging er fout bij het registeren");
        }
    } catch (error) {
        console.error("Fout bij Registeren: " + error.message);
        const { current_state, message } = RegisterError(error);
        return { success: false, current_state, message };
    }
}

/**
 * It's logging out exactly what one would expect,
 * calls out the endpoint in the back-end. Deleting
 * any existing token for the logged in user.
 * Will do the same on the front-end, deleting them
 * from the local storage. Before navigating the user
 * back to the log in page.
 * @param {*} navigate
 */
export async function Logout(navigate) {
    try {
        const response = await api.post("/logout");
        if (response.status === 200) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refresh_token");
            navigate("/");
        } else {
            console.error(response.status + " Logging out failed!");
        }
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * A function to delete all conversations from the database that are binded to the user.
 * Will need a confirmation to make sure that the function has to be executed.
 * Will delete all conversations upon success, will give an error upon failure.
 * @param {*} confirmation
 * @param {*} navigate
 */
export async function DeleteAllPersonalConversations(confirmation, navigate) {
    if (!confirmation) return;
    try {
        const response = await api.delete("/conversations");
        if (response.status === 200) {
            navigate("/main");
        } else {
            console.error("Iets ging fout bij het verwijderen!");
        }
    } catch (error) {
        console.error("Fout bij gesprekken verwijderen: " + error.message);
    }
}

/**
 * This function creates a new conversation for the user.
 * Will create a new conversation upon success, will not
 * create a new conversation upon failure.
 * Will throw an error upon failure.
 * Will return the current user the conversation correlates to
 * and the created date and time the conversation was made.
 * @param {*} navigate
 * @returns a new conversation
 */
export async function StartNewConversation(navigate) {
    try {
        const response = await api.post("/conversations");
        if (response.status === 200) {
            navigate("/main");
            return {
                userId: response.data.user_id,
                createdAt: response.data.created_at,
            };
        } else {
            console.error("Iets ging fout bij het maken van een nieuw gesprek!");
        }
    } catch (error) {
        console.error("Fout bij nieuwe gesprek starten: " + error.message);
    }
}

/**
 * This function deletes a single conversation from the database, that is binded to the user.
 * Will need a confirmation to make sure that the function has to be executed.
 * Will delete a conversation upon succession, will not remove a conversation upon failure.
 * Will return false once the given conversationId isn't a number.
 * Will show an error upon failure.
 * @param {*} confirmation
 * @param {*} conversationId
 * @param {*} navigate
 * @returns a boolean or nothing
 */
export async function DeleteSingleConversation(confirmation, conversationId, navigate) {
    if (!confirmation || !Number.isInteger(conversationId)) return false;
    try {
        const response = await api.delete(`/conversations/${conversationId}`);
        if (response.status === 200) {
            navigate("/main");
        } else {
            console.error("Er ging iets fout bij het verwijderen van een gesprek");
        }
    } catch (error) {
        console.error("Fout bij verwijderen gesprek: " + error.message);
    }
}

/**
 * This function retrieves all existing messages for a single conversation.
 * Will return an array with necessary Message data upon success,
 * will return an empty array upon failure.
 * Will return false once the given conversation id isn't a number.
 * Will error upon failure.
 * @param {*} conversationId
 * @returns a boolean or array
 */
export async function GetConversationMessages(conversationId) {
    if (!Number.isInteger(conversationId)) return false;
    try {
        const response = await api.get(`/conversations/${conversationId}/messages`);
        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Iets ging er fout bij het ophalen van berichten");
            return [];
        }
    } catch (error) {
        console.error("Fout bij ophalen van berichten: " + error.message);
        return [];
    }
}

/**
 * This function retrieves all conversations that are bonded to the user.
 * Will return an array with necessary information upon success,
 * will return an empty array upon failure or once there are no conversations.
 * Will given an error upon failure.
 * @returns an array
 */
export async function GetAllConversations() {
    try {
        const response = await api.get("/conversations");
        if (response.status === 200) {
            return response.data;
        } else {
            console.error("Iets ging er fout bij het ophalen van alle gesprekken!");
            return [];
        }
    } catch (error) {
        console.error("Fout bij het ophalen van gesprekken: " + error.message);
        return [];
    }
}

/**
 * Haal info over huidige gebruiker op.
 * Will return username and role upon success,
 * or null upon failure.
 * @returns {Promise<{username: string, role: string}>}
 */
export async function GetCurrentUser() {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        console.error("Fout bij ophalen huidige gebruiker:", error);
        return null;
    }
}

/**
 * Verifieer een token (optioneel voor checks).
 * Will return success info or null upon failure.
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function VerifyToken(token) {
    try {
        const response = await api.get(`/verify-token/${token}`);
        return response.data;
    } catch (error) {
        console.error("Fout bij token verificatie:", error);
        return null;
    }
}

/**
 * Refresh het access token (meestal via interceptor, hier voor fallback).
 * Will return new tokens upon success or null upon failure.
 * @param {string} refreshToken
 * @returns {Promise<object>}
 */
export async function RefreshAccessToken(refreshToken) {
    try {
        const response = await api.post("/token/refresh", {
            refresh_token: refreshToken,
        });
        return response.data;
    } catch (error) {
        console.error("Fout bij refresh token:", error);
        return null;
    }
}

/**
 * Revoke refresh token (optioneel, admin-only).
 * Will return success message or null upon failure.
 * @param {string} refreshToken
 * @returns {Promise<object>}
 */
export async function RevokeRefreshToken(refreshToken) {
    try {
        const response = await api.post("/token/revoke", {
            refresh_token: refreshToken,
        });
        return response.data;
    } catch (error) {
        console.error("Fout bij revoke token:", error);
        return null;
    }
}
