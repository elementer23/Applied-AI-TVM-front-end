import api from "./api";
import { LoginError, RegisterError, RequestError } from "./errorHandler";

/**
 * Request function, this function expects text like input
 * and will return a proper response from the AI upon a successful attempt.
 * Will return an answer depending on the given input
 * and will return an empty string upon a failed attempt.
 * @param {*} requestedInput
 * @param {*} conversationId
 * @returns output depending on the outcome
 */
export async function Request(requestedInput, conversationId) {
    const token = sessionStorage.getItem("token");

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
        const response = await api.post("/run", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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
            //set the token and refresh_token upon logging in
            sessionStorage.setItem("token", response.data.access_token);
            sessionStorage.setItem(
                "refresh_token",
                response.data.refresh_token
            );
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
 * This function registers a new user into the database.
 * Will add a new user upon success, will not create a new user upon failure.
 * Will return an error upon failure or a message upon success.
 * @param {*} requested_data
 * @returns data depending on the outcome
 */
export async function RegisterUser(requested_data) {
    const token = sessionStorage.getItem("token");

    const form = new URLSearchParams();
    form.append("username", requested_data.username);
    form.append("password", requested_data.password);
    form.append("role", "user");

    try {
        const response = await api.post("/users/?" + form.toString(), null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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
    const token = sessionStorage.getItem("token");

    try {
        if (confirmation) {
            const response = await api.delete("/conversations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                navigate("/main");
            } else {
                console.error("Iets ging fout bij het verwijderen!");
            }
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
 * @returns a new conversation
 */
export async function startNewConversation() {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.post("/conversations", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            // navigate("/main");
            return {
                success: true,
                id: response.data.id,
                userId: response.data.user_id,
                createdAt: response.data.created_at,
            };
        } else {
            console.error(
                "Iets ging fout bij het maken van een nieuw gesprek!"
            );
        }
    } catch (error) {
        console.error("Fout bij nieuwe gesprek starten: " + error.message);
        return { success: false };
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
export async function DeleteSingleConversation(
    confirmation,
    conversationId,
    navigate
) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(conversationId)) {
        return false;
    }

    try {
        if (confirmation) {
            const response = await api.delete(
                `/conversations/${conversationId}`,
                { conversation_id: conversationId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                navigate("/main");
            } else {
                console.error(
                    "Er ging iets fout bij het verwijderen van een gesprek"
                );
            }
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
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(conversationId)) {
        return false;
    }

    try {
        let arr = [];
        const response = await api.get(
            `/conversations/${conversationId}/messages`,
            { conversation_id: conversationId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            for (var item of response.data) {
                arr.push(item);
            }

            return arr;
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
    const token = sessionStorage.getItem("token");

    try {
        let arr = [];
        const response = await api.get("/conversations", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            for (var item of response.data) {
                arr.push(item);
            }

            return arr;
        } else {
            console.error(
                "Iets ging er fout bij het ophalen van alle gesprekken!"
            );
            return [];
        }
    } catch (error) {
        console.error("Fout bij het ophalen van gesprekken: " + error.message);
        return [];
    }
}
