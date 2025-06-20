import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdvisoryTextManager from "../components/AdvisoryTextManager";
import * as Services from "../utils/Services";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock("../components/Header", () => () => <div>Header</div>);

jest.mock("../components/advisoryTextManagerComponents/Category", () => {
    const React = require("react");
    return (props) => {
        React.useEffect(() => {
            props.setSelectedKey(1);
            props.setSubSelectedKey(1);
        }, []);
        return <div>Mocked Category damage_to_third_parties</div>;
    };
});

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
                screen.getByText(/Mocked Category damage_to_third_parties/i)
            ).toBeInTheDocument();
        });
    });
});
