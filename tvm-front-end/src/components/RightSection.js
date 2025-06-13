import React, { useState, useEffect } from "react";
import Header from "./Header";
import { sendAdviceRequest } from "../utils/Services";
import MessageOutcomeComponent from "./errorComponents/MessageOutcomeComponent";

function RightSection({
    conversationId,
    setConversationId,
    currentConversationMessages,
    reFetchMessages,
    reFetchConversations,
}) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [outcomeHandler, setOutcomeHandler] = useState({
        success: null,
        error: null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) {
            setInput("");
            setOutput("");
            setOutcomeHandler({ success: null, error: null });
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
        // if (!input.trim()) return;
        setLoading(true);
        setOutcomeHandler({ success: null, error: null });

        const data = await sendAdviceRequest(input, conversationId);
        setLoading(false);

        if (data.success) {
            setOutput(
                data.current_response || "Geen aangepast advies ontvangen."
            );
            setConversationId(data.current_conversation_id);
            await reFetchMessages();
            await reFetchConversations();
        } else {
            setOutcomeHandler({ success: null, error: data.message });
        }
    };

    return (
        <div className="section right-section">
            <Header />
            <MessageOutcomeComponent
                outcomeHandler={outcomeHandler}
                setOutcomeHandler={setOutcomeHandler}
            />
            <div className="scrollable-content">
                <h2>
                    Plak hieronder je adviesrapport. Je ontvangt automatisch een
                    aangepaste versie terug.
                </h2>

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

            <button
                className="generate-btn"
                onClick={handleGenerateAdvice}
                disabled={loading}
            >
                {loading
                    ? "Bezig met genereren..."
                    : "Genereer aangepast adviesrapport"}
            </button>
        </div>
    );
}

export default RightSection;
