import api from "./api";
import { LoginError } from "./errorHandler";

/**
 * Request function, this function expects text like input
 * and will return a proper response from the AI upon a successful attempt.
 * Will return an answer depending on the given input
 * and will return an empty string upon a failed attempt.
 * @param {*} requestedInput
 * @returns a string
 */
export async function Request(requestedInput) {
    const token = sessionStorage.getItem("token");

    //Keep in mind that the given variable in this case "input", will have to be equal to the
    //field variable in the back-end. Meaning that if there is a class in the back-end called i don't know,
    //InputData and it has a field called input. Then input will be the variable to send with on the front-end.
    //And if it's called something like message, then the variable on the front-end needs to be called message too.
    //If it doesn't equal, then it won't receive the data and it will not perform an action.. most likely resulting
    //in an error. So keep that in mind. back-end: input -> { input: requestedInput } else
    //back-end: message -> { message: requestedInput }.

    try {
        const response = await api.post(
            "/run",
            { input: requestedInput },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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
