import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../css/Error.css";
import { sendAdviceRequest } from "../utils/Services";

function RightSection({
    conversationId,
    setConversationId,
    currentConversationMessages,
    reFetchMessages,
    reFetchConversations,
}) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) {
            setInput("");
            setOutput("");
            setError(null);
            return;
        }

        if (!currentConversationMessages?.length) {
            setInput("");
            setOutput("");
            return;
        }

        const sorted = [...currentConversationMessages].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const userMessages = sorted.filter((msg) => msg.is_user_message);
        const aiMessages = sorted.filter((msg) => !msg.is_user_message);

        const lastUserMsg = userMessages[userMessages.length - 1];
        const lastAiMsg = aiMessages[aiMessages.length - 1];

        setInput(lastUserMsg?.content || "");
        setOutput(lastAiMsg?.content || "");
    }, [conversationId, currentConversationMessages]);

    const handleGenerateAdvice = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError(null);

        const out = await sendAdviceRequest(input, conversationId);
        setLoading(false);

        if (out.success) {
            setOutput(out.current_response || "Geen aangepast advies ontvangen.");
            setConversationId(out.current_conversation_id);
            await reFetchMessages();
            await reFetchConversations();
        } else {
            setError(out.message);
        }
    };

    return (
        <div className="section right-section">
            <Header />
            <div className="scrollable-content">
                {error && <div className="errorComponent">{error}</div>}

            <h2>Plak hieronder je adviesrapport. Je ontvangt automatisch een aangepaste versie terug.</h2>

            <div className="advice-panels">
                <div className="advice-panel">
                    <h3>Origineel Adviesrapport</h3>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Plak hier je originele adviesrapport..."
                        className="advice-textarea"
                    />
                </div>

                <div className="advice-panel">
                    <h3>Aangepast Adviesrapport</h3>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Het aangepaste advies verschijnt hier..."
                        className="advice-textarea"
                    />
                </div>
            </div>
        </div>

            <button className="generate-btn" onClick={handleGenerateAdvice} disabled={loading}>
                {loading ? "Bezig met genereren..." : "Genereer aangepast adviesrapport"}
            </button>
        </div>
    );
}

export default RightSection;
