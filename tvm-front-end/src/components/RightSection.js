import React, { useRef } from "react";
import { Request } from "../Services";
import { useState } from "react";
import Header from "./Header";

function RightSection() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const fileInputRef = useRef();

    const handleSend = async () => {
        const response = await Request(input);
        setOutput(response);
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
            <div className="chat-section">
                <div className="chat-messages">
                    {/* Chat messages will go here */}
                    <img
                        className="chat-image"
                        src="/images/AI_profile.png"
                        alt="Logo"
                    />
                    <div className="chat-message">
                        <p className="message-text">
                            Waar kan ik je mee van dienst zijn?
                        </p>
                    </div>
                </div>
            </div>
            <div className="chat-input-row">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => e.target.value}
                    className="chat-input"
                    placeholder="Tekstvak voor eventuele toelichting"
                />
                <button className="send-btn" onClick={handleSend}>
                    Verstuur
                </button>
                <button
                    className="upload-btn"
                    onClick={() => fileInputRef.current.click()}
                >
                    Bestand uploaden
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
