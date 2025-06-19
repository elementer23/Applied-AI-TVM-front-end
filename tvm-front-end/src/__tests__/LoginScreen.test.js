import LoginScreen from "../components/LoginScreen";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

it("Renders a login screen", () => {
    render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );
});
