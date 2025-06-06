import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logout } from "../utils/Services";

function Header({ variant }) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    // const [user, setUser] = useState(null);

    // useEffect(() => {
    //     async function fetchUser() {
    //         const userData = await GetCurrentUser();
    //         setUser(userData);
    //     }
    //     fetchUser();
    // }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigation = (option) => {
        if (option === "usermanagement") {
            navigate("/usermanagement");
        } else if (option === "dashboard") {
            navigate("/categoryMain");
        } else if (option === "main") {
            navigate("/main");
        } else if (option === "logout") {
            Logout(navigate);
        }
        setShowDropdown(false);
    };

    return (
        <div
            className={`section-header ${
                variant === "beheer" ? "section-header--beheer" : ""
            }`}
        >
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
                            <li //{user?.role === "admin" && ( )} werkt momenteel niet
                                className="dropdown-item"
                                onClick={() =>
                                    handleNavigation("usermanagement")
                                }
                            >
                                Gebruikersbeheer
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
