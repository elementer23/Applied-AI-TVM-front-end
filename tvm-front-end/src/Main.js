import "./css/App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import { useEffect, useState } from "react";
import { GetAllConversations, GetConversationMessages } from "./utils/Services";    

function Main() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function fetchConversations() {
            const data = await GetAllConversations();
            setConversations(data); 
        }

        fetchConversations();
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            if (selectedConversationId) {
                const data = await GetConversationMessages(selectedConversationId);
                setMessages(data);
            }
        }

        fetchMessages();
    }, [selectedConversationId]);

    return (
        <div className="main-container">
            <LeftSection
                conversations={conversations}
                onSelectConversation={setSelectedConversationId}
            />
            <RightSection
                messages={messages}
                conversationId={selectedConversationId}          
            />
        </div>
    );
}

export default Main;
