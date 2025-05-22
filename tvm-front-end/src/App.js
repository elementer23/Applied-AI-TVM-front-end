import "./App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import LoginScreen from "./components/LoginScreen";

import React, { useState } from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="main-container">
            <LeftSection />
            <RightSection />
        </div>
    );
}

export default App;
