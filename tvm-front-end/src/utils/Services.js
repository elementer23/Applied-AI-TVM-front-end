import api from "./api";
import { LoginError, RegisterError, RequestError } from "./errorHandler";

/**
 * Request function, this function expects text like input
 * and will return a proper response from the AI upon a successful attempt.
 * Will return an answer depending on the given input
 * and will return an error object upon a failed attempt.
 * @param {string} requestedInput
 * @param {number|null} conversationId (optioneel)
 * @returns {Promise<{success: boolean, current_response?: string, current_state?: string, message?: string}>}
 */
export async function Request(requestedInput, conversationId = null) {
    let data = {
        input: requestedInput,
    };

    if (conversationId !== null) {
        data.conversation_id = conversationId;
    }

    //Keep in mind that the given variable in this case "input", will have to be equal to the
    //field variable in the back-end. Meaning that if there is a class in the back-end called i don't know,
    //InputData and it has a field called input. Then input will be the variable to send with on the front-end.
    //And if it's called something like message, then the variable on the front-end needs to be called message too.
    //If it doesn't equal, then it won't receive the data and it will not perform an action.. most likely resulting
    //in an error. So keep that in mind. back-end: input -> { input: requestedInput } else
    //back-end: message -> { message: requestedInput }.

    try {
        const response = await api.post("/run", data);

        //The comment from above applies to what is returned as well. If you return something through a certain name like
        //in this case "output", then it needs to be the same on the front-end as well. Or else you might send something
        //which will work, but you won't get anything in return.

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data.output,
            };
        }
    } catch (error) {
        console.error("Fout bij request:", error.message);
        const { current_state, message } = RequestError(error);
        return {
            success: false,
            current_state,
            message,
        };
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
            //set the access_token and refresh_token upon logging in
            sessionStorage.setItem("access_token", response.data.access_token); // <-- aangepast
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
    const token = sessionStorage.getItem("token");

    try {
        // Stuur de data als JSON body!
        const response = await api.post("/users/", requested_data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            return { success: true };
        } else {
            console.error("Iets ging er fout bij het registeren");
            return { success: false, message: "Onbekende fout" };
        }
    } catch (error) {
        console.error("Fout bij Registeren: " + error.message);
        return { success: false, message: error.message };
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
            sessionStorage.removeItem("access_token");
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
 * Haal info op van de huidige gebruiker (username en rol).
 * Handig om te checken of iemand admin is, of voor display.
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
 * Haal alle gebruikers op (alleen voor admin).
 * @returns {Promise<Array>} lijst van users
 */
export async function GetAllUsers() {
    const response = await api.get("/users/");
    return response.data;
}

/**
 * Pas een gebruiker aan (rol/wachtwoord) - alleen admin.
 * @param {number} userId 
 * @param {object} userData (bijv. { role: "admin", password: "nieuwwachtwoord" })
 */
export async function UpdateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
}

/**
 * Verwijder een gebruiker - alleen admin.
 * @param {number} userId 
 */
export async function DeleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
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
        }
    } catch (error) {
        console.error("Fout bij gesprekken verwijderen: " + error.message);
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
 * (Optioneel) Valideer een token. Alleen nodig als je zelf tokens wil checken buiten standaard login.
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
