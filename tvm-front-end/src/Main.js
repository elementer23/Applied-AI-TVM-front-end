import "./css/App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import { useEffect, useState, useCallback } from "react";
import { GetAllConversations, GetConversationMessages } from "./utils/Services";

function Main() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);

    async function fetchConversations() {
        const data = await GetAllConversations();
        setConversations(data);
    }

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchMessages = useCallback(async () => {
        if (selectedConversationId) {
            const data = await GetConversationMessages(selectedConversationId);
            setMessages(data);
        }
    }, [selectedConversationId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return (
        <div className="main-container">
            <LeftSection
                conversations={conversations}
                onSelectConversation={setSelectedConversationId}
                reFetchConversations={fetchConversations}
            />
            <RightSection
                messages={messages}
                conversationId={selectedConversationId}
                setConversationId={setSelectedConversationId}
                reFetchMessages={fetchMessages}
                reFetchConversations={fetchConversations}
            />
        </div>
    );
}

export default Main;
