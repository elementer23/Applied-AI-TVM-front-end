import axios from "axios";
import { useState } from "react";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

export async function Request(question) {
    const [answer, setAnswer] = useState("");

    //Keep in mind that the given variable in this case "input", will have to be equal to the
    //field variable in the back-end. Meaning that if there is a class in the back-end called i don't know,
    //InputData and it has a field called input. Then input will be the variable to send with on the front-end.
    //And if it's called something like message, then the variable on the front-end needs to be called message too.
    //If it doesn't equal, then it won't receive the data and it will not perform an action.. most likely resulting
    //in an error. So keep that in mind. back-end: input -> { input: question } else
    //back-end: message -> { message: question }.
    const response = await api.post("/run", { input: question });
    //The comment from above applies to what is returned as well. If you return something through a certain name like
    //in this case "output", then it needs to be the same on the front-end as well. Or else you might send something
    //which will work, but you won't get anything in return.
    setAnswer(response.data.output);
}

export async function Login(requested_data) {
    console.log(requested_data);

    const form = new URLSearchParams();
    form.append("username", requested_data.username);
    form.append("password", requested_data.password);

    const response = await api.post("/token", form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    console.log(response.data.access_token);
}
