import { Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AccountManager from "./components/AccountManager";
import UserManagement from "./components/UsernManagement";
import Main from "./Main";
import CategoryMainScreen from "./components/CategoryMainScreen";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/main" element={<Main />} />
            <Route path="/categoryMain" element={<CategoryMainScreen />} />
            <Route path="/accountManager" element={<AccountManager />} />
             <Route path="/usermanagement" element={<UserManagement />} />
        </Routes>
    );
}

export default App;
