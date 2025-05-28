import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logout } from "../utils/Services";

function Header() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigation = (option) => {
        if (option === "account") {
            navigate("/accountManager");
        } else if (option === "dashboard") {
            navigate("/textChanger");
        } else if (option === "main") {
            navigate("/main");
        } else if (option === "logout") {
            Logout(navigate);
        }
        setShowDropdown(false);
    };

    return (
        <div className="section-header">
            <img
                className="image-header"
                src="/images/tvmLogo.png"
                alt="Logo"
                onClick={() => handleNavigation("main")}
            />
            <div className="profile-dropdown-container">
                <img
                    className="profile-header"
                    src="/images/TVM_profile.png"
                    alt="Profile"
                    onClick={toggleDropdown}
                />
                {showDropdown && (
                    <div className="dropdown-menu">
                        <ul>
                            <li
                                className="dropdown-item"
                                onClick={() => handleNavigation("account")}
                            >
                                Account aanmaken
                            </li>
                            <li
                                className="dropdown-item"
                                onClick={() => handleNavigation("dashboard")}
                            >
                                Dashboard
                            </li>
                            <li
                                className="dropdown-item"
                                onClick={() => handleNavigation("logout")}
                            >
                                Uitloggen
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
