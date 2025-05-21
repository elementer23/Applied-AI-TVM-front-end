import { useState } from "react";
import "./App.css";
import axios from "axios";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import LoginScreen from "./components/LoginScreen";

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
        </div>
    );
}

export default App;
