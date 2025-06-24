import App from "../App";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

it("Render the app", () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
});
