import { render, screen, fireEvent } from "@testing-library/react";
import Category from "../components/advisoryTextManagerComponents/Category";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock(
    "../components/advisoryTextManagerComponents/Subcategory",
    () => () => <div>Mocked Subcategory</div>
);

describe("Category", () => {
    const category = { id: 1, name: "test_category" };
    const subcategories = [{ id: 10, name: "sub1" }];

    const defaultProps = {
        category,
        selectedKey: null,
        setSelectedKey: jest.fn(),
        subcategories,
        subSelectedKey: null,
        setSubSelectedKey: jest.fn(),
        advisoryText: null,
        onAdvisoryUpdate: jest.fn(),
        onAdvisoryDelete: jest.fn(),
        onCategoryUpdate: jest.fn(),
        onCategoryDelete: jest.fn(),
        searchTerm: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders category name correctly and toggles selection", () => {
        render(<Category {...defaultProps} />);
        expect(screen.getByText("test category")).toBeInTheDocument();

        fireEvent.click(screen.getByText("test category"));
        expect(defaultProps.setSelectedKey).toHaveBeenCalledWith(
            expect.any(Function)
        );
    });

    it("shows input box when edit button is clicked and updates category", () => {
        render(<Category {...defaultProps} />);

        fireEvent.click(screen.getByTitle("Pas categorie aan"));

        expect(screen.getByDisplayValue("test_category")).toBeInTheDocument();

        fireEvent.change(screen.getByDisplayValue("test_category"), {
            target: { value: "updated_category" },
        });

        expect(screen.getByDisplayValue("updated_category").value).toBe(
            "updated_category"
        );

        fireEvent.click(screen.getByText("update"));

        expect(defaultProps.onCategoryUpdate).toHaveBeenCalledWith(
            category.id,
            "updated_category"
        );
    });

    it("calls onCategoryDelete after confirming deletion twice", () => {
        window.confirm = jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);

        render(<Category {...defaultProps} />);

        fireEvent.click(screen.getByTitle("Verwijder advies"));

        expect(window.confirm).toHaveBeenCalledTimes(2);
        expect(defaultProps.onCategoryDelete).toHaveBeenCalledWith(
            category.id,
            true
        );
    });

    it("renders subcategories when selected", () => {
        render(<Category {...defaultProps} selectedKey={category.id} />);

        expect(screen.getByText("Mocked Subcategory")).toBeInTheDocument();
    });

    it("shows message if no subcategories exist", () => {
        render(
            <Category
                {...defaultProps}
                selectedKey={category.id}
                subcategories={[]}
            />
        );

        expect(
            screen.getByText(
                "Momenteel geen subcategorieën voor de gevraagde categorie."
            )
        ).toBeInTheDocument();
    });
});
