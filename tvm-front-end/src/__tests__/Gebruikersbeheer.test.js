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
