import React, { useRef } from "react";
import { Request } from "../utils/Services";
import { useState } from "react";
import Header from "./Header";
import "../css/Error.css";

function RightSection({
    messages,
    conversationId,
    reFetchMessages,
    reFetchConversations,
}) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(null);
    const fileInputRef = useRef();

    const handleSend = async () => {
        console.log(
            "Bericht verzenden:",
            input,
            "naar gesprek:",
            conversationId
        );
        const out = await Request(input, conversationId);

        if (out.success) {
            setInput("");
            await reFetchMessages();
            await reFetchConversations();
        } else {
            setError(out.message);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`Selected file: ${file.name}`);
        }
    };

    return (
        <div className="section right-section">
            <Header />
            {error && <div className="errorComponent">{error}</div>}
            <div className="chat-section">
                <div className="chat-messages">
                    {messages.map((message) => (
                        <div key={message.id} className="chat-message">
                            <p>
                                <strong>
                                    {message.sender === "user" ? "jij" : "AI"}:
                                </strong>
                                {""}
                                {message.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-input-row">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="chat-input"
                    placeholder="Typ je bericht hier..."
                />
                <button className="send-btn" onClick={handleSend}>
                    Verstuur
                </button>
                <button
                    className="upload-btn"
                    onClick={() => fileInputRef.current.click()}
                >
                    Bestand uploaden
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
            </div>
        </div>
    );
}

export default RightSection;
