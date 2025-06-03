import React, { useRef } from "react";
import { Request } from "../utils/Services";
import { useState } from "react";
import Header from "./Header";
import "../css/Error.css";

function RightSection({
    messages,
    conversationId,
    setConversationId,
    reFetchMessages,
    reFetchConversations,
}) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    const handleSend = async () => {
        console.log("Bericht verzenden:", input);
        setLoading(true);
        const out = await Request(input, conversationId);
        setLoading(false);

        if (out.success) {
            setInput(""); 
            await reFetchMessages();
            await reFetchConversations();
            setConversationId(out.current_conversation_id);
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
                        <div
                            key={message.id}
                            className={
                                message.is_user_message
                                    ? "chat-message user"
                                    : "chat-message"
                            }
                        >
                            <p>
                                <strong>
                                    {message.is_user_message ? "jij" : "AI"}:
                                </strong>
                                {""}
                                {message.content}
                            </p>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-message ai loading-indicator">
                            <p><strong>AI:</strong> AI-agent is aan het denken...</p>
                        </div>
                    )}
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
