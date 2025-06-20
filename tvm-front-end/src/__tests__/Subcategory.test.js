import { render, screen, fireEvent } from "@testing-library/react";
import Subcategory from "../components/advisoryTextManagerComponents/Subcategory";

jest.mock("../css/AdvisoryManager.module.css", () => ({}));

jest.mock(
    "../components/advisoryTextManagerComponents/AdvisoryText",
    () => () => <div>Mocked AdvisoryText</div>
);

describe("Subcategory", () => {
    const subcategory = { id: 1, name: "test_subcategory" };
    const advisoryText = { id: 10, text: "Some advice here" };

    const defaultProps = {
        subcategory,
        subSelectedKey: null,
        setSubSelectedKey: jest.fn(),
        advisoryText: null,
        onAdvisoryUpdate: jest.fn(),
        onAdvisoryDelete: jest.fn(),
        searchTerm: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders subcategory name correctly with underscores replaced", () => {
        render(<Subcategory {...defaultProps} />);

        expect(screen.getByText("test subcategory")).toBeInTheDocument();
    });

    it("calls setSubSelectedKey with correct toggling behavior on click", () => {
        render(<Subcategory {...defaultProps} />);

        fireEvent.click(screen.getByText("test subcategory"));
        expect(defaultProps.setSubSelectedKey).toHaveBeenCalledWith(
            expect.any(Function)
        );
    });

    it("renders message if selected but no advisoryText", () => {
        render(
            <Subcategory {...defaultProps} subSelectedKey={subcategory.id} />
        );

        expect(
            screen.getByText(/Er is hier geen advies tekst voor beschikbaar/i)
        ).toBeInTheDocument();
    });

    it("renders AdvisoryText component if selected and advisoryText exists", () => {
        render(
            <Subcategory
                {...defaultProps}
                subSelectedKey={subcategory.id}
                advisoryText={advisoryText}
            />
        );

        expect(screen.getByText("Mocked AdvisoryText")).toBeInTheDocument();
    });

    it("applies highlight style and scrolls into view when searchTerm matches subcategory name", () => {
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        render(<Subcategory {...defaultProps} searchTerm="test" />);

        expect(
            screen.getByText("test subcategory").parentElement.parentElement
        ).toHaveStyle("background-color: #ffffcc");

        expect(scrollIntoViewMock).toHaveBeenCalled();
    });

    it("does not highlight or scroll when searchTerm does not match", () => {
        const scrollIntoViewMock = jest.fn();
        window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

        render(<Subcategory {...defaultProps} searchTerm="nomatch" />);
        expect(
            screen.getByText("test subcategory").parentElement.parentElement
        ).toHaveStyle("background-color: transparent");

        expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
});
