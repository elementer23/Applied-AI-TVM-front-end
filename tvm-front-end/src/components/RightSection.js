import React, { useRef, useEffect } from "react";
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
    const [localMessages, setLocalMessages] = useState([]);
    const fileInputRef = useRef();
    const chatMessagesRef = useRef();

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(), // tijdelijke unieke id
            is_user_message: true,
            content: input,
        };

        setLocalMessages((prev) => [...prev, newMessage]);
        setInput(""); // Leeg tekstveld direct na verzenden
        setLoading(true);

        const out = await Request(input, conversationId);
        setLoading(false);

        if (out.success) {
            setLocalMessages([]); // Leeg lokale tijdelijke berichten
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
                <div className="chat-messages" ref={chatMessagesRef}>
                    {[...messages, ...localMessages].map((message) => (
                        <div
                            key={message.id}
                            className={
                                message.is_user_message
                                    ? "chat-message user"
                                    : "chat-message"
                            }
                        >
                            <p style={{ whiteSpace: "pre-wrap" }}>
                                <strong>
                                    {message.is_user_message ? "jij" : "AI"}:
                                </strong>
                                {"\n"}
                                {message.content.replace("\n", "\r\n")}
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
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="chat-input"
                    placeholder="Typ je bericht hier..."
                    rows={1}
                />
                <button className="send-btn" onClick={handleSend}>
                    Verstuur
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
