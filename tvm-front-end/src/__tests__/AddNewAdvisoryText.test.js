import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AddNewAdvisoryText from "../components/AddNewAdvisoryText";
import * as Services from "../utils/Services";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock("../components/Header", () => () => <div>Header</div>);

describe("AddNewAdvisoryText", () => {
    const mockCategories = [
        { id: 1, name: "damage_to_third_parties" },
        { id: 2, name: "damage_by_standstill" },
    ];

    const mockSubcategories = [
        { id: 1, name: "minrisk" },
        { id: 2, name: "risk_in_euros" },
        { id: 3, name: "deviate_from_identification" },
        { id: 4, name: "identify_by_risk" },
    ];

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

        jest.spyOn(Services, "CreateAdvisoryText").mockResolvedValue({
            success: true,
            message: "Advisory created successfully",
        });
    });

    it("Renders form from component with categories and subcategories", async () => {
        render(<AddNewAdvisoryText />);

        await waitFor(() => {
            expect(
                screen.getByRole("combobox", { name: /Category naam/i })
            ).toBeInTheDocument();
            expect(
                screen.getByText(/Bestaande Subcategorieën/i)
            ).toBeInTheDocument();
        });
    });

    it("form input successfull run", async () => {
        render(<AddNewAdvisoryText />);

        await waitFor(() =>
            screen.getByRole("combobox", { name: /Category naam/i })
        );

        fireEvent.change(screen.getByLabelText(/Sub-category naam/i), {
            target: { value: "Test subcategory" },
        });

        fireEvent.change(screen.getByLabelText(/Bijbehorende tekst/i), {
            target: { value: "Bij de aansprakelijkheid van deze verzekering." },
        });

        fireEvent.click(screen.getByText(/Creëren/i));

        await waitFor(() => {
            expect(
                screen.getByText("Advisory created successfully")
            ).toBeInTheDocument();
        });
    });

    it("retrieving categories failure run error", async () => {
        jest.spyOn(Services, "GetAllCategories").mockResolvedValue({
            success: false,
            message: "Failed to retrieve categories",
        });

        render(<AddNewAdvisoryText />);

        await waitFor(() => {
            expect(
                screen.getByText(/Geen categorieën om advies teksten/i)
            ).toBeInTheDocument();
        });
    });

    it("input form failure error", async () => {
        jest.spyOn(Services, "CreateAdvisoryText").mockResolvedValue({
            success: false,
            message: "failed to create new advisory text",
        });

        render(<AddNewAdvisoryText />);

        await waitFor(() =>
            screen.getByRole("combobox", { name: /Category naam/i })
        );

        fireEvent.change(screen.getByLabelText(/Sub-category naam/i), {
            target: { value: "warning slechte tekst" },
        });

        fireEvent.change(screen.getByLabelText(/Bijbehorende tekst/i), {
            target: { value: "slechte tekst." },
        });

        fireEvent.click(screen.getByText(/Creëren/i));

        await waitFor(() => {
            expect(
                screen.getByText("failed to create new advisory text")
            ).toBeInTheDocument();
        });
    });
});
