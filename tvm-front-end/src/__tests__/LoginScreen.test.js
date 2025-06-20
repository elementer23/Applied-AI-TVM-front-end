import LoginScreen from "../components/LoginScreen";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import * as Services from "../utils/Services";

jest.mock("../utils/Services", () => ({
    Login: jest.fn(),
}));

it("Renders a login screen", () => {
    render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Gebruikersnaam/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Wachtwoord/i)).toBeInTheDocument();
    expect(
        screen.getByRole("button", { name: /Inloggen/i })
    ).toBeInTheDocument();
});

it("Inputs update when typed into", () => {
    render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Gebruikersnaam/i);
    const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("secret");
});

it("Shows error message on failed login", async () => {
    Services.Login.mockResolvedValueOnce({
        success: false,
        message: "Invalide credentialen",
    });

    render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText(/Gebruikersnaam/i);
    const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);

    fireEvent.change(usernameInput, { target: { value: "invalidUser" } });
    fireEvent.change(passwordInput, { target: { value: "invalidPass" } });

    fireEvent.click(screen.getByRole("button", { name: /Inloggen/i }));

    await waitFor(() => {
        expect(screen.getByText(/Invalide credentialen/i)).toBeInTheDocument();
    });

    expect(Services.Login).toHaveBeenCalledWith(
        { username: "invalidUser", password: "invalidPass" },
        expect.any(Function)
    );
});
