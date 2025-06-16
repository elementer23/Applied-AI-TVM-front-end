import "./css/App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import { useEffect, useState, useCallback } from "react";
import { GetAllConversations, GetConversationMessages } from "./utils/Services";
import MessageOutcomeComponent from "./components/errorComponents/MessageOutcomeComponent";

function Main() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [outcomeHandler, setOutcomeHandler] = useState({
        success: null,
        error: null,
    });

    async function fetchConversations() {
        const data = await GetAllConversations();
        setConversations(data);
    }

    const fetchMessages = useCallback(async () => {
        if (selectedConversationId) {
            const data = await GetConversationMessages(selectedConversationId);
            if (data.success) {
                setMessages(data.current_response);
            } else {
                setOutcomeHandler({ success: null, error: data.message });
            }
        }
    }, [selectedConversationId]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return (
        <div className="main-container">
            <MessageOutcomeComponent
                outcomeHandler={outcomeHandler}
                setOutcomeHandler={setOutcomeHandler}
            />
            <LeftSection
                conversations={conversations}
                onSelectConversation={setSelectedConversationId}
                reFetchConversations={fetchConversations}
                reFetchMessages={fetchMessages}
                onNewConversationId={setSelectedConversationId}
            />
            <RightSection
                conversationId={selectedConversationId}
                setConversationId={setSelectedConversationId}
                currentConversationMessages={messages}
                reFetchMessages={fetchMessages}
                reFetchConversations={fetchConversations}
            />
        </div>
    );
}

export default Main;
