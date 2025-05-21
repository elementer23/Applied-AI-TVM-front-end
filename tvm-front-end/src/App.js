import "./App.css";
import Services from "./Services";
import axios from "axios";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import LoginScreen from "./components/LoginScreen";

import React, { useState } from "react";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="main-container">
            <LeftSection />
            <RightSection />
           {/* <Services /> */} 
        </div>
    );
}

export default App;
