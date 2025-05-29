import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import LeftSection from "./components/LeftSection";
import RightSection from "./components/RightSection";


function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <LeftSection />
      <RightSection />
      <button
        className="navigate-button"
        onClick={() => navigate("/advies")}
      >
        Ga naar advies pagina
      </button>
    </div>
  );
}

export default Main;
