import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdvisoryTextManager from "../components/AdvisoryTextManager";
import * as Services from "../utils/Services";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock("../components/Header", () => () => <div>Header</div>);

describe("AdvisoryTextManager", () => {
    const mockCategories = [{ id: 1, name: "damage_to_third_parties" }];

    const mockSubcategories = [{ id: 1, name: "minrisk" }];

    const mockAdvisoryText = [{ id: 1, text: "a really long text" }];

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Services, "GetAllCategories").mockResolvedValue({
            success: true,
            current_response: mockCategories,
        });

        jest.spyOn(Services, "GetAllSubcategoriesByCategory").mockResolvedValue(
            {
                success: true,
                current_response: mockSubcategories,
            }
        );

        jest.spyOn(
            Services,
            "GetAdvisoryTextBySubcategoryId"
        ).mockResolvedValue({
            success: true,
            current_response: mockAdvisoryText,
        });
    });

    it("renders with categories and shows the header", async () => {
        render(<AdvisoryTextManager />);

        await waitFor(() => {
            expect(screen.getByText(/Advies overzicht/i)).toBeInTheDocument();
        });

        expect(screen.getByPlaceholderText(/Zoeken/i)).toBeInTheDocument();
    });

    it("shows a message when no categories exist", async () => {
        Services.GetAllCategories.mockResolvedValue({
            success: false,
            message: null,
        });

        render(<AdvisoryTextManager />);

        await waitFor(() => {
            expect(
                screen.getByText(/Er zijn momenteel geen categorieën/i)
            ).toBeInTheDocument();
        });
    });

    it("updates the search term state on input", async () => {
        render(<AdvisoryTextManager />);

        const searchInput = await screen.findByPlaceholderText("Zoeken...");

        fireEvent.change(searchInput, { target: { value: "damage" } });

        await waitFor(() => {
            expect(searchInput.value).toBe("damage");
        });
    });

    it("loads subcategories and advisory text when category is selected", async () => {
        render(<AdvisoryTextManager />);

        await waitFor(() => {
            expect(
                screen.getByText(/damage to third parties/i)
            ).toBeInTheDocument();
        });
    });

    it("updates a category name when edited and submitted", async () => {
        const mockUpdate = jest
            .spyOn(Services, "UpdateCategory")
            .mockResolvedValue({
                success: true,
                message: "Updated successfully",
            });

        render(<AdvisoryTextManager />);

        fireEvent.click(await screen.findByTitle("Pas categorie aan"));

        fireEvent.change(screen.getByDisplayValue("damage_to_third_parties"), {
            target: { value: "updated_category" },
        });

        fireEvent.click(screen.getByText("update"));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith(1, "updated_category");
        });
    });

    it("deletes a category when double confirmation is accepted", async () => {
        const mockDelete = jest
            .spyOn(Services, "DeleteSingleCategory")
            .mockResolvedValue({
                success: true,
                message: "Deleted successfully",
            });

        jest.spyOn(window, "confirm").mockImplementation(() => true);

        render(<AdvisoryTextManager />);

        fireEvent.click(await screen.findByTitle("Verwijder advies"));

        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith(1, true);
        });

        window.confirm.mockRestore();
    });

    it("updates an advisory text when edited and saved", async () => {
        const mockUpdateAdvice = jest
            .spyOn(Services, "UpdateAdvisoryText")
            .mockResolvedValue({
                success: true,
                message: "Advice updated",
            });

        render(<AdvisoryTextManager />);

        fireEvent.click(await screen.findByText(/damage to third parties/i));

        fireEvent.click(await screen.findByText(/minrisk/i));

        fireEvent.click(await screen.findByTitle("Pas advies aan"));

        fireEvent.change(screen.getByPlaceholderText(/typ hier je advies/i), {
            target: { value: "Updated text" },
        });

        fireEvent.click(screen.getByTestId("update-advisory-btn"));

        await waitFor(() => {
            expect(mockUpdateAdvice).toHaveBeenCalledWith(
                undefined,
                "Updated text"
            );
        });
    });
});
