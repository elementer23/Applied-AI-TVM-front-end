import React, { useState, useEffect } from "react";
import Header from "./Header";
import { sendAdviceRequest } from "../utils/Services";
import MessageOutcomeComponent from "./errorComponents/MessageOutcomeComponent";

/**
 * This is a component which shows
 * the right section of the Main component.
 * Here one can talk to the Ai and request
 * output upon a corresponding input.
 * Will show a corresponding conversation
 * depending on the id or an already previous
 * started conversation.. continuing from there on.
 * @param {*} conversationId - the id of the conversation to show
 * @param {*} setConversationId - the state to set the conversation id with
 * @param {*} currentConversationMessages - the messages of the chosen conversation
 * @param {*} reFetchMessages - method to refetch the message to push through changes
 * @param {*} reFetchConversations - method to refetch the conversations to push through changes
 * @returns The RightSection component
 */
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
                            value={
                                loading ? "AI is bezig met nadenken..." : output
                            }
                            readOnly
                            placeholder="Het aangepaste advies verschijnt hier..."
                            className={`advice-textarea ${
                                loading ? "loading-output" : ""
                            }`}
                        />
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
        </div>
    );
}

export default RightSection;
