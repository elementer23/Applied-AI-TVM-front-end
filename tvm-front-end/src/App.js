import { Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import TextChangerScreen from "./components/TextChangerScreen";
import AccountManager from "./components/AccountManager";
import UserManagement from "./components/UserManagement";
import Main from "./Main";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/main" element={<Main />} />
            <Route path="/textChanger" element={<TextChangerScreen />} />
            <Route path="/accountManager" element={<AccountManager />} />
            <Route path="/admin/users" element={<UserManagement />} />
        </Routes>
    );
}

export default App;
