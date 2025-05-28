import "./css/App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";

function Main() {
    return (
        <div className="main-container">
            <LeftSection />
            <RightSection />
        </div>
    );
}

export default Main;
