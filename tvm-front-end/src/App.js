import { Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import Main from "./Main";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/main" element={<Main />} />
        </Routes>
    );
}

export default App;
