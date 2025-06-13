import {
    DeleteSingleConversation,
    StartNewConversation,
} from "../utils/Services";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import MessageOutcomeComponent from "./errorComponents/MessageOutcomeComponent";

function LeftSection({
    conversations,
    onSelectConversation,
    reFetchConversations,
    reFetchMessages,
    onNewConversationId,
}) {
    const navigate = useNavigate();
    const [outcomeHandler, setOutcomeHandler] = useState({
        success: null,
        error: null,
    });

    const handleNewConversation = async () => {
        const data = await StartNewConversation();

        if (data.success) {
            await reFetchConversations();
            onNewConversationId(data.id);
            await reFetchMessages();
        }
    };

    const handleSelectConversation = async (conversationId) => {
        onSelectConversation(conversationId);
        await reFetchMessages();
    };

    const handleDeleteConversation = async (conversationId, e) => {
        e.stopPropagation();
        const confirmDelete = window.confirm(
            "Weet je zeker dat je dit gesprek wilt verwijderen?"
        );
        if (confirmDelete) {
            const data = await DeleteSingleConversation(
                confirmDelete,
                conversationId,
                navigate
            );
            if (data.success) {
                await reFetchConversations();
                setOutcomeHandler({ success: null, error: null });
            } else {
                setOutcomeHandler({ success: null, error: data.message });
            }
        }
    };

    return (
        <div className="section left-section">
            <div></div>
            <MessageOutcomeComponent
                outcomeHandler={outcomeHandler}
                setOutcomeHandler={setOutcomeHandler}
            />
            <div className="history-content">
                <p>
                    <strong>Gesprek geschiedenis</strong>
                </p>
                <ul>
                    {conversations.map((conversation) => (
                        <li
                            key={conversation.id}
                            onClick={() =>
                                handleSelectConversation(conversation.id)
                            }
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <strong>{conversation.title}</strong>{" "}
                                <i>
                                    {new Date(
                                        conversation.created_at
                                    ).toLocaleDateString()}
                                </i>
                            </div>
                            <button
                                onClick={(e) =>
                                    handleDeleteConversation(conversation.id, e)
                                }
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "red",
                                    cursor: "pointer",
                                }}
                                title="Verwijder gesprek"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="new-chat">
                <button
                    className="new-chat-button"
                    onClick={handleNewConversation}
                >
                    Nieuw gesprek
                </button>
            </div>
        </div>
    );
}

export default LeftSection;
