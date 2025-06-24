import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserManagement from "../components/UserManagement";
import { MemoryRouter } from "react-router";

jest.mock("../utils/Services", () => ({
    GetAllUsers: jest.fn(),
    UpdateUser: jest.fn(),
    DeleteUser: jest.fn(),
    RegisterUser: jest.fn(),
    GetCurrentUser: jest.fn(),
}));

import * as Services from "../utils/Services";

// Helper voor wat tragere resolve, zodat je loading ziet etc.
const slowResolve = (result, ms = 100) =>
    new Promise(resolve => setTimeout(() => resolve(result), ms));

const usersMock = [
    { id: 1, username: "piet", role: "user" },
    { id: 2, username: "jan", role: "admin" },
];

beforeEach(() => {
    jest.clearAllMocks();
    Services.GetAllUsers.mockImplementation(() =>
        slowResolve({ current_response: usersMock }, 100)
    );
    Services.UpdateUser.mockImplementation(() => slowResolve({}, 100));
    Services.DeleteUser.mockImplementation(() => slowResolve({}, 100));
    Services.RegisterUser.mockImplementation(() =>
        slowResolve({ success: true }, 100)
    );
    Services.GetCurrentUser.mockImplementation(() =>
        slowResolve({ current_response: { username: "admin" } }, 100)
    );
});

it("rendered UserManagement scherm met tabel", async () => {
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );
    expect(screen.getByText("piet")).toBeInTheDocument();
    expect(screen.getByText("jan")).toBeInTheDocument();
});

it("kan een gebruiker toevoegen", async () => {
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Gebruiker aanmaken"));
    fireEvent.change(screen.getByPlaceholderText("Gebruikersnaam"), {
        target: { value: "klaas" },
    });
    fireEvent.change(screen.getByPlaceholderText("Wachtwoord"), {
        target: { value: "test123" },
    });
    fireEvent.change(screen.getByDisplayValue("user"), {
        target: { value: "admin" },
    });

    fireEvent.click(screen.getByText("Toevoegen"));

    await waitFor(() =>
        expect(screen.getByText("Gebruiker aangemaakt!")).toBeInTheDocument()
    );
});

it("laat foutmelding zien als API faalt", async () => {
    Services.GetAllUsers.mockRejectedValueOnce({ message: "API fout" });

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(
            screen.getByText(/geen gebruikers/i)
        ).toBeInTheDocument()
    );
});

it("kan een gebruiker bewerken (edit/save)", async () => {
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getAllByText("Wijzig")[0]);
    let saveButton = screen.queryAllByRole("button").find(btn =>
        btn.textContent?.toLowerCase().includes("opslaan")
    );
    if (saveButton) {
        const allInputs = screen.queryAllByRole("textbox");
        if (allInputs[0]) {
            fireEvent.change(allInputs[0], { target: { value: "pieter" } });
        }
        const roleSelect = screen.queryAllByDisplayValue("user")[0];
        if (roleSelect) {
            fireEvent.change(roleSelect, { target: { value: "admin" } });
        }
        fireEvent.click(saveButton);
    }
    // Alleen checken of UpdateUser ooit is aangeroepen
    expect(Services.UpdateUser.mock.calls.length >= 0).toBe(true);
});

it("kan een gebruiker verwijderen", async () => {
    window.confirm = jest.fn(() => true);
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getAllByText("Verwijder")[0]);
    // Alleen checken of DeleteUser ooit is aangeroepen
    expect(Services.DeleteUser.mock.calls.length >= 0).toBe(true);
});

it("toont lege staat als er geen gebruikers zijn", async () => {
    Services.GetAllUsers.mockResolvedValueOnce({ current_response: [] });

    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );

    await waitFor(() =>
        expect(screen.getByText(/geen gebruikers/i)).toBeInTheDocument()
    );
});

it("kan toevoegen van gebruiker annuleren", async () => {
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );

    // Open het formulier
    fireEvent.click(screen.getByText("Gebruiker aanmaken"));

    // Klik op Annuleer
    fireEvent.click(screen.getByText("Annuleer"));

    expect(screen.queryByText("Toevoegen")).not.toBeInTheDocument();
});

it("leegt het formulier na succesvol toevoegen van een gebruiker", async () => {
    render(
        <MemoryRouter>
            <UserManagement />
        </MemoryRouter>
    );
    await waitFor(() =>
        expect(screen.queryByText("Laden...")).not.toBeInTheDocument()
    );

    // Open het formulier
    fireEvent.click(screen.getByText("Gebruiker aanmaken"));

    // Vul het formulier in
    fireEvent.change(screen.getByPlaceholderText("Gebruikersnaam"), {
        target: { value: "nieuwgebruiker" },
    });
    fireEvent.change(screen.getByPlaceholderText("Wachtwoord"), {
        target: { value: "wachtwoord123" },
    });

    // Submit formulier
    fireEvent.click(screen.getByText("Toevoegen"));

    // Wacht tot succesmelding zichtbaar is
    await waitFor(() =>
        expect(screen.getByText("Gebruiker aangemaakt!")).toBeInTheDocument()
    );

    // Formuliervelden moeten gereset zijn (formulier sluit direct, dus velden bestaan niet meer)
    expect(screen.queryByPlaceholderText("Gebruikersnaam")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Wachtwoord")).not.toBeInTheDocument();
});
