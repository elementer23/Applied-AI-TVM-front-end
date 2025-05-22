import "./App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";
import { VerifyToken } from "./Services";
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    const tokenHandler = async () => {
        await VerifyToken(navigate);
    };

    tokenHandler();

    return (
        <div className="main-container">
            <LeftSection />
            <RightSection />
        </div>
    );
}

export default Main;
