import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import LeftSection from "../components/LeftSection";
import * as Services from "../utils/Services";

jest.mock("../utils/Services", () => ({
    DeleteSingleConversation: jest.fn(),
    StartNewConversation: jest.fn(),
}));

jest.mock("../components/errorComponents/MessageOutcomeComponent", () => ({
    __esModule: true,
    default: ({ outcomeHandler }) => (
        <div data-testid="msg-outcome">
            {outcomeHandler?.error && <span>{outcomeHandler.error}</span>}
            {outcomeHandler?.success && <span>{outcomeHandler.success}</span>}
        </div>
    ),
}));

describe("LeftSection", () => {
    const mockSelect = jest.fn();
    const mockRefetchConvos = jest.fn();
    const mockRefetchMessages = jest.fn();
    const mockNewConvId = jest.fn();

    const conversations = [
        {
            id: 1,
            title: "Test Gesprek",
            created_at: "2024-06-19T10:00:00Z",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRouter = (component) => {
        return render(<MemoryRouter>{component}</MemoryRouter>);
    };

    it("renders conversation list", () => {
        renderWithRouter(
            <LeftSection
                conversations={conversations}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        expect(screen.getByText("Gesprek geschiedenis")).toBeInTheDocument();
        expect(screen.getByText("Test Gesprek")).toBeInTheDocument();
    });

    it("starts a new conversation", async () => {
        Services.StartNewConversation.mockResolvedValueOnce({
            success: true,
            id: 99,
        });

        renderWithRouter(
            <LeftSection
                conversations={[]}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        fireEvent.click(screen.getByText("Nieuw gesprek"));

        await waitFor(() => {
            expect(Services.StartNewConversation).toHaveBeenCalled();
            expect(mockNewConvId).toHaveBeenCalledWith(99);
        });
    });

    it("handles conversation delete failure", async () => {
        window.confirm = jest.fn(() => true);

        Services.DeleteSingleConversation.mockResolvedValueOnce({
            success: false,
            message: "Verwijderen mislukt",
        });

        renderWithRouter(
            <LeftSection
                conversations={conversations}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        fireEvent.click(screen.getByTitle("Verwijder gesprek"));

        await waitFor(() => {
            expect(screen.getByText("Verwijderen mislukt")).toBeInTheDocument();
        });
    });

    it("calls onSelectConversation and refetchMessages on select", async () => {
        renderWithRouter(
            <LeftSection
                conversations={conversations}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        fireEvent.click(screen.getByText("Test Gesprek"));

        await waitFor(() => {
            expect(mockSelect).toHaveBeenCalledWith(1);
            expect(mockRefetchMessages).toHaveBeenCalled();
        });
    });

    it("clears message outcome on successful delete", async () => {
        window.confirm = jest.fn(() => true);

        Services.DeleteSingleConversation.mockResolvedValueOnce({
            success: true,
        });

        renderWithRouter(
            <LeftSection
                conversations={conversations}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        fireEvent.click(screen.getByTitle("Verwijder gesprek"));

        await waitFor(() => {
            expect(mockRefetchConvos).toHaveBeenCalled();
        });
    });

    it("renders formatted date in conversation", () => {
        renderWithRouter(
            <LeftSection
                conversations={conversations}
                onSelectConversation={mockSelect}
                reFetchConversations={mockRefetchConvos}
                reFetchMessages={mockRefetchMessages}
                onNewConversationId={mockNewConvId}
            />
        );

        const date = new Date(conversations[0].created_at).toLocaleDateString();
        expect(screen.getByText(date)).toBeInTheDocument();
    });
});
