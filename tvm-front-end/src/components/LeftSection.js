import { DeleteSingleConversation, StartNewConversation } from "../utils/Services";
import { useNavigate } from "react-router-dom";
import { Coffee, Delete, Trash2 } from "lucide-react";

function LeftSection({
    conversations,
    onSelectConversation,
    reFetchConversations,
}) {

    const navigate = useNavigate();
    const handleNewConversation = async () => {
        const out = await StartNewConversation();

        if (out.success) {
            await reFetchConversations();
            onSelectConversation(out.id);
        }
    };

    const handleDeleteConversation = async (conversationId, e) => {
        e.stopPropagation();
        const confirmDelete = window.confirm(
            "Weet je zeker dat je dit gesprek wilt verwijderen?");
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
                            onClick={() => onSelectConversation(conversation.id)}
                            style={{ 
                                cursor: "pointer", 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center" 
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
            <div className="guidelines-content">
                <p>
                    <strong>Richtlijn bestanden</strong>
                </p>
                <ul>
                    <li>
                        <strong>Richtlijn bestand 1</strong> <i>Versie 1</i>
                    </li>
                    <li>
                        <strong>Richtlijn bestand 2</strong> <i>Versie 2</i>
                    </li>
                    <li>
                        <strong>Richtlijn bestand 3</strong> <i>Versie 3</i>
                    </li>
                    <li>
                        <strong>Richtlijn bestand 4</strong> <i>Versie 4</i>
                    </li>
                    <li>
                        <strong>Richtlijn bestand 5</strong> <i>Versie 5</i>
                    </li>
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
