import { render, screen, fireEvent } from "@testing-library/react";
import AdvisoryText from "../components/advisoryTextManagerComponents/AdvisoryText";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

describe("AdvisoryText", () => {
    const advisoryText = { id: 1, text: "Initial advisory text" };
    const onAdvisoryUpdate = jest.fn();
    const onAdvisoryDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders advisory text initially", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        expect(screen.getByText("Initial advisory text")).toBeInTheDocument();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("shows textarea when edit button is clicked", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Pas advies aan"));
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("Initial advisory text")
        ).toBeInTheDocument();
    });

    it("updates edited text on textarea change", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Pas advies aan"));
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Updated advisory text" },
        });
        expect(screen.getByRole("textbox").value).toBe("Updated advisory text");
    });

    it("calls onAdvisoryUpdate with correct arguments when update clicked", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Pas advies aan"));
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Updated advisory text" },
        });

        fireEvent.click(screen.getByText("update"));

        expect(onAdvisoryUpdate).toHaveBeenCalledWith(
            1,
            "Updated advisory text"
        );

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("calls onAdvisoryDelete when delete is confirmed", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Verwijder advies"));
        expect(window.confirm).toHaveBeenCalled();
        expect(onAdvisoryDelete).toHaveBeenCalledWith(1);
    });

    it("does not call onAdvisoryDelete if deletion is cancelled", () => {
        window.confirm.mockImplementationOnce(() => false);

        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Verwijder advies"));
        expect(onAdvisoryDelete).not.toHaveBeenCalled();
    });

    it("cancels editing and resets text when cancel button is clicked", () => {
        render(
            <AdvisoryText
                advisoryText={advisoryText}
                onAdvisoryUpdate={onAdvisoryUpdate}
                onAdvisoryDelete={onAdvisoryDelete}
            />
        );

        fireEvent.click(screen.getByTitle("Pas advies aan"));
        fireEvent.change(screen.getByRole("textbox"), {
            target: { value: "Changed text" },
        });

        fireEvent.click(screen.getByText("cancel"));

        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        expect(screen.getByText("Initial advisory text")).toBeInTheDocument();
    });
});
