import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AddNewCategory from "../components/AddNewCategory";
import * as Services from "../utils/Services";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock("../components/Header", () => () => <div>Header</div>);

describe("AddNewCategory", () => {
    const mockCategories = [
        { id: 1, name: "damage_to_third_parties" },
        { id: 2, name: "damage_by_standstill" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Services, "GetAllCategories").mockResolvedValue({
            success: true,
            current_response: mockCategories,
        });

        jest.spyOn(Services, "CreateNewCategory").mockResolvedValue({
            success: true,
            message: "New category added",
        });
    });

    it("Properly render the component", async () => {
        render(<AddNewCategory />);

        await waitFor(() => {
            expect(
                screen.getByText(/Bestaande categorieën/i)
            ).toBeInTheDocument();
        });
    });

    it("Properly add a new category", async () => {
        render(<AddNewCategory />);

        fireEvent.change(screen.getByLabelText(/categorie naam/i), {
            target: { value: "Nieuwe categorie" },
        });

        fireEvent.click(screen.getByText(/Creëren/i));

        await waitFor(() => {
            expect(screen.getByText("New category added")).toBeInTheDocument();
        });
    });

    it("Failed to get categories or no categories present", async () => {
        jest.spyOn(Services, "GetAllCategories").mockResolvedValue({
            success: false,
            message: null,
        });

        render(<AddNewCategory />);

        await waitFor(() => {
            expect(
                screen.getByText(/Geen bestaande categorieën/i)
            ).toBeInTheDocument();
        });
    });

    it("Failed to create new category", async () => {
        jest.spyOn(Services, "CreateNewCategory").mockResolvedValue({
            success: false,
            message: "Could not add new category",
        });

        render(<AddNewCategory />);

        fireEvent.change(screen.getByLabelText(/categorie naam/i), {
            target: { value: null },
        });

        fireEvent.click(screen.getByText(/Creëren/i));

        await waitFor(() => {
            expect(
                screen.getByText("Could not add new category")
            ).toBeInTheDocument();
        });
    });
});
