import { useState } from "react";
import "./App.css";
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

function App() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handler = async (e) => {
        e.preventDefault();
        console.log("your question: ", question);
        const response = await api.post("/test2", { message: question });
        setAnswer(response.data.answer);
    };

    return (
        <div>
            <form>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button type="submit" onClick={handler}>
                    click
                </button>
            </form>
            <div>
                <h2>answer:</h2>
                <p>{answer}</p>
            </div>
        </div>
    );
}

export default App;
