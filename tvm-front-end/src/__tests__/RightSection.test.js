import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RightSection from "../components/RightSection";
import * as Services from "../utils/Services";

jest.mock("../utils/Services", () => ({
    sendAdviceRequest: jest.fn(),
}));

jest.mock("../components/Header", () => () => <div>Mocked Header</div>);
jest.mock("../components/errorComponents/MessageOutcomeComponent", () => ({
    __esModule: true,
    default: ({ outcomeHandler }) => (
        <div>
            {outcomeHandler?.error && <div>{outcomeHandler.error}</div>}
            {outcomeHandler?.success && <div>{outcomeHandler.success}</div>}
        </div>
    ),
}));

describe("RightSection", () => {
    const mockSetConversationId = jest.fn();
    const mockReFetchMessages = jest.fn();
    const mockReFetchConversations = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Renders all elements", () => {
        render(
            <RightSection
                conversationId={1}
                setConversationId={mockSetConversationId}
                currentConversationMessages={[]}
                reFetchMessages={mockReFetchMessages}
                reFetchConversations={mockReFetchConversations}
            />
        );

        expect(
            screen.getByText(/Plak hieronder je adviesrapport/i)
        ).toBeInTheDocument();
    });

    it("Populates textareas based on messages", () => {
        const messages = [
            {
                id: 1,
                is_user_message: true,
                content: "Origineel advies",
                created_at: new Date().toISOString(),
            },
            {
                id: 2,
                is_user_message: false,
                content: "Aangepast advies",
                created_at: new Date().toISOString(),
            },
        ];

        render(
            <RightSection
                conversationId={5}
                setConversationId={mockSetConversationId}
                currentConversationMessages={messages}
                reFetchMessages={mockReFetchMessages}
                reFetchConversations={mockReFetchConversations}
            />
        );

        expect(screen.getByDisplayValue("Origineel advies")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Aangepast advies")).toBeInTheDocument();
    });

    it("Calls sendAdviceRequest on generate click (success)", async () => {
        Services.sendAdviceRequest.mockResolvedValueOnce({
            success: true,
            current_response: "Nieuwe AI advies",
            current_conversation_id: 999,
        });

        render(
            <RightSection
                conversationId={7}
                setConversationId={mockSetConversationId}
                currentConversationMessages={[]}
                reFetchMessages={mockReFetchMessages}
                reFetchConversations={mockReFetchConversations}
            />
        );

        const input = screen.getByPlaceholderText(/originele adviesrapport/i);
        fireEvent.change(input, { target: { value: "Wat input" } });

        const button = screen.getByRole("button", {
            name: /Genereer aangepast adviesrapport/i,
        });

        fireEvent.click(button);

        await waitFor(() => {
            expect(Services.sendAdviceRequest).toHaveBeenCalledWith(
                "Wat input",
                7
            );
        });
    });

    it("Shows error message on failed request", async () => {
        Services.sendAdviceRequest.mockResolvedValueOnce({
            success: false,
            message: "Er ging iets mis",
        });

        render(
            <RightSection
                conversationId={3}
                setConversationId={mockSetConversationId}
                currentConversationMessages={[]}
                reFetchMessages={mockReFetchMessages}
                reFetchConversations={mockReFetchConversations}
            />
        );

        const input = screen.getByPlaceholderText(/originele adviesrapport/i);
        fireEvent.change(input, { target: { value: "Inhoud" } });

        fireEvent.click(
            screen.getByRole("button", {
                name: /Genereer aangepast adviesrapport/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Er ging iets mis/i)
            ).toBeInTheDocument();
        });
    });
});
