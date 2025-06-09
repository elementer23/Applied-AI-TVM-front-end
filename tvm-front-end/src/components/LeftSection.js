import { DeleteSingleConversation, StartNewConversation } from "../utils/Services";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function LeftSection({
    conversations,
    onSelectConversation,
    reFetchConversations,
    reFetchMessages,
    onNewConversationId, // <-- toegevoegd
}) {
    const navigate = useNavigate();

    const handleNewConversation = async () => {
        const out = await StartNewConversation();

        if (out.success) {
            onNewConversationId(out.id); // geef ID van nieuw gesprek aan parent
            await reFetchConversations(); // daarna pas gesprekken ophalen
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
            await DeleteSingleConversation(true, conversationId, navigate);
            await reFetchConversations();
        }
    };

    return (
        <div className="section left-section">
            <div></div>
            <div className="history-content">
                <p><strong>Gesprek geschiedenis</strong></p>
                <ul>
                    {conversations.map((conversation) => (
                        <li
                            key={conversation.id}
                            onClick={() => handleSelectConversation(conversation.id)}
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <strong>{conversation.title}</strong>{" "}
                                <i>{new Date(conversation.created_at).toLocaleDateString()}</i>
                            </div>
                            <button
                                onClick={(e) => handleDeleteConversation(conversation.id, e)}
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
