import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../components/Header";
import * as Services from "../utils/Services";
import { MemoryRouter } from "react-router";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../utils/Services", () => ({
    GetCurrentUser: jest.fn(),
    Logout: jest.fn(),
}));

describe("Header", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders and toggles dropdown", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "user" },
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        expect(await screen.findByAltText("Profile")).toBeInTheDocument();

        fireEvent.click(screen.getByAltText("Profile"));
        expect(screen.getByText("Hoofdmenu")).toBeInTheDocument();
    });

    it("shows admin link if user is admin", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "admin" },
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByAltText("Profile"));
        expect(await screen.findByText("Gebruikersbeheer")).toBeInTheDocument();
    });

    it("navigates and logs out on dropdown click", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "user" },
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByAltText("Profile"));
        fireEvent.click(screen.getByText("Uitloggen"));

        await waitFor(() => {
            expect(Services.Logout).toHaveBeenCalledWith(expect.any(Function));
        });
    });

    it("applies beheer variant class when variant is 'beheer'", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "user" },
        });

        const { container } = render(
            <MemoryRouter>
                <Header variant="beheer" />
            </MemoryRouter>
        );

        expect(container.firstChild).toHaveClass("section-header--beheer");
    });

    it("navigates to dashboard when Dashboard is clicked", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "user" },
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByAltText("Profile"));
        fireEvent.click(screen.getByText("Dashboard"));

        expect(mockNavigate).toHaveBeenCalledWith("/categoryMain");
    });

    it("navigates to main when logo is clicked", async () => {
        Services.GetCurrentUser.mockResolvedValueOnce({
            current_response: { role: "user" },
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByAltText("Logo"));

        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});
