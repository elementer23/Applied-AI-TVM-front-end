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
                current_conversation_id: response.data.conversation_id,
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
export async function StartNewConversation() {
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

/**
 * This function retrieves the current logged in user.
 * Will return an username and a role that befits the current user.
 * Will return corresponding data upon success and nothing upon failure.
 * Will show an error upon failure.
 * @returns a boolean or a set of data.
 */
export async function GetCurrentUser() {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.get("/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error("Fout bij ophalen huidige gebruiker:", error.message);
        return { success: false };
    }
}

/**
 * This function revokes the refresh token upon use.
 * Will return a set of data and a success response upon success,
 * will return a failure response upon failure.
 * Will show an error upon failure.
 * Keep in mind, this function can only be executed with admin level authentication.
 * @returns a boolean or data response
 */
export async function RevokeRefreshToken() {
    const refreshToken = sessionStorage("refresh_token");
    const token = sessionStorage("token");

    try {
        const response = await api.post(
            "/token/revoke",
            {
                refresh_token: refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error("Fout bij revoke token:", error);
        return { success: false };
    }
}

/**
 * This function will return all advisory texts from the database.
 * Will return a set of data upon success, will return nothing and an error upon failure.
 * @returns a boolean or set of data
 */
export async function GetAllAdvisoryTexts() {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.get("/advisorytexts/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error("Fout bij ophalen van advies teksten:", error.message);
        return { success: false };
    }
}

/**
 * This function returns a single advisory text based on the given id.
 * Will return a set of data upon success and nothing with an error upon failure.
 * Will return failure once the given id was incorrect, didn't exist or wasn't a number.
 * @param {*} textId
 * @returns a boolean or message
 */
export async function GetAdvisoryTextById(textId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(textId)) return { success: false };

    try {
        const response = await api.get(`/advisorytexts/id=${textId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error("Fout bij ophalen van advies tekst:", error.message);
        return { success: false };
    }
}

/**
 * This function updates the advisory text, depending on the id, category id and subcategory.
 * Will return a message upon success, will return nothing and an error upon failure.
 * Will return failure once the given id's are incorrect, not numbers or don't exist.
 * @param {*} textId
 * @param {*} adviceText
 * @returns a boolean or message
 */
export async function UpdateAdvisoryText(textId, adviceText) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(textId)) return { success: false };

    try {
        const response = await api.put(
            `/advisorytexts/id=${textId}`,
            {
                text: adviceText,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error("Fout bij updaten van advies tekst:", error.message);
        return { success: false };
    }
}

/**
 * This function creates a new advisory text based on
 * the belonging category id and subcategory.
 * Will return a message upon success, will return nothing and
 * an error upon failure. Will fail once the id hasn't been set
 * or once the categoryId isn't a number or if it doesn't exist.
 * @param {*} formData
 * @returns a boolean or message
 */
export async function CreateAdvisoryText(formData) {
    const token = sessionStorage.getItem("token");

    if (formData.categoryId === null || !Number.isInteger(formData.categoryId))
        return { success: false };

    try {
        const response = await api.post(
            "/advisorytexts/",
            {
                category_id: formData.categoryId,
                sub_category: formData.subcategory,
                text: formData.advice_text,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                current_response: response.data.content,
            };
        }
    } catch (error) {
        console.error("Fout bij aanmaken van advies tekst:", error.message);
        return { success: false };
    }
}

/**
 * This function deletes an advisory text depending on the given id.
 * Will return a message upon success, will return nothing and an error upon failure.
 * Will return failure once the given id is incorrect or isn't a number.
 * @param {*} textId
 * @returns a boolean or message
 */
export async function DeleteAdvisoryText(textId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(textId)) return { success: false };

    try {
        const response = await api.delete(`/advisorytexts/id=${textId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data.content,
            };
        }
    } catch (error) {
        console.error("Fout bij verwijderen van advies tekst:", error.message);
        return { success: false };
    }
}

/**
 * This function returns an advisory text based on the subcategory id.
 * Will return a set of data upon success, will return nothing and an error upon failure.
 * Will return failure once the given id was invalid, didn't exist or wasn't a number.
 * @param {*} subcategoryId
 * @returns a boolean or a set of data
 */
export async function GetAdvisoryTextBySubcategoryId(subcategoryId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(subcategoryId)) return { success: false };

    try {
        const response = await api.get(
            `/advisorytexts/subcategory/${subcategoryId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function retrieves all categories from the database.
 * Will return data upon a successfull attempt, will return failure
 * upon a failing attempt. Will show an error upon failure.
 * @returns a boolean or corresponding data
 */
export async function GetAllCategories() {
    const token = sessionStorage.getItem("token");

    try {
        let arr = [];
        const response = await api.get("/categories/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            for (var item of response.data) {
                arr.push(item);
            }

            return {
                success: true,
                current_response: arr,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function retrieves a single category belonging to a corresponding id.
 * Will return data upon success, will return false upon failure.
 * Will not work if the given id isn't a number.
 * Will give an error upon failure.
 * @param {*} categoryId
 * @returns a boolean or data
 */
export async function GetSingleCategory(categoryId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(categoryId)) return { success: false };

    try {
        const response = await api.get(`/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function creates a new category by name.
 * Will return data upon success and will return false upon failure.
 * Will show a message upon success and an error upon failure.
 * @param {*} categoryName
 * @returns a boolean or message
 */
export async function CreateNewCategory(categoryName) {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.post(
            "/categories/",
            { name: categoryName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function updates a category by category id and a new name.
 * Will return a success message upon a successful attempt,
 * will return a failure response upon failure.
 * Will show an error upon failure.
 * @param {*} categoryId
 * @param {*} categoryName
 * @returns a boolean or message
 */
export async function UpdateCategory(categoryId, categoryName) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(categoryId)) return { success: false };

    try {
        const response = await api.put(
            `/categories/${categoryId}`,
            { name: categoryName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function deletes a single category based on the given id.
 * Will need a confirmation to continue, to make sure that the action was deliberate.
 * Will return a message upon success and false with an error upon failure.
 * @param {*} categoryId
 * @param {*} confirmation
 * @returns a boolean or message
 */
export async function DeleteSingleCategory(categoryId, confirmation) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(categoryId) || !confirmation)
        return { success: false };

    try {
        const response = await api.delete(`/categories/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function retrieves all of the subcategories from the database.
 * Will return data upon success, will return nothing and an error upon failure.
 * @returns a boolean or data
 */
export async function GetAllSubcategories() {
    const token = sessionStorage.getItem("token");

    try {
        const response = await api.get("/subcategories/", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error(error.message);
        return { success: false };
    }
}

/**
 * This function returns all subcategories that belong to the given category id.
 * Will return a set of data upon success, will return nothing and an error upon failure.
 * Will return failure once category id is invalid, not a number or doesn't exist.
 * @param {*} categoryId
 * @returns a boolean or a set of data
 */
export async function GetAllSubcategoriesByCategory(categoryId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(categoryId)) return { success: false };

    try {
        let arr = [];
        const response = await api.get(
            `/categories/${categoryId}/subcategories`,
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
            return {
                success: true,
                current_response: arr,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * This function retrieves a single subcategory based on the id.
 * Will return a set of data upon success, will return nothing and an error upon failure.
 * @param {*} subcategoryId
 * @returns a boolean or data
 */
export async function GetSingleSubcategory(subcategoryId) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(subcategoryId)) return { success: false };

    try {
        const response = await api.get(`/subcategories/${subcategoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return {
                success: true,
                current_response: response.data,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * @deprecated
 * This function updates a subcategory based on the id and a new name.
 * Will return a success message upon a successful attempt,
 * will return nothing and an error upon failure.
 * Will return failure once the given id isn't a number or
 * once the given id doesn't exist.
 * @param {*} subcategoryId
 * @param {*} subcategoryName
 * @returns a boolean or message
 */
export async function UpdateSubcategory(subcategoryId, subcategoryName) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(subcategoryId)) return { success: false };

    try {
        const response = await api.put(
            `/subcategories/${subcategoryId}`,
            {
                name: subcategoryName,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
        };
    }
}

/**
 * @deprecated
 * This function delets a subcategory based on the id.
 * Will return a message upon success and nothing with an error upon failure.
 * Will return failure once the given id is not a number or
 * once the confirmation hasn't been made.
 * @param {*} subcategoryId
 * @param {*} confirmation
 * @returns a boolean or message
 */
export async function DeleteSingleSubcategory(subcategoryId, confirmation) {
    const token = sessionStorage.getItem("token");

    if (!Number.isInteger(subcategoryId) || !confirmation)
        return { success: false };

    try {
        const response = await api.delete(`/subcategories/${subcategoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            return {
                success: true,
                current_content: response.data.content,
            };
        }
    } catch (error) {
        console.error(error.message);
        return { success: false };
    }
}

export async function UpdateUser(userId, userData) {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.put(`/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Fout bij updaten gebruiker:", error);
        throw error;
    }
}

export async function GetAllUsers() {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.get("/users/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Fout bij ophalen gebruikers:", error);
        return [];
    }
}

export async function DeleteUser(userId) {
    const token = sessionStorage.getItem("token");
    try {
        const response = await api.delete(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Fout bij verwijderen gebruiker:", error);
        throw error;
    }
}
