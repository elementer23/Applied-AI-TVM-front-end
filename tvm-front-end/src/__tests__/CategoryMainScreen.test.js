import { render, screen, fireEvent } from "@testing-library/react";
import CategoryMainScreen from "../components/CategoryMainScreen";

jest.mock("../components/AdvisoryTextManager", () => () => (
    <div>AdvisoryTextManager</div>
));
jest.mock("../components/AddNewAdvisoryText", () => () => (
    <div>AddNewAdvisoryText</div>
));
jest.mock("../components/AddNewCategory", () => () => (
    <div>AddNewCategory</div>
));

describe("CategoryMainScreen", () => {
    it("Renders the default component AdvisoryTextManager", () => {
        render(<CategoryMainScreen />);
        expect(screen.getByText(/AdvisoryTextManager/i)).toBeInTheDocument();
    });

    it("Switches to the component AddNewAdvisoryText", () => {
        render(<CategoryMainScreen />);
        fireEvent.click(
            screen.getByRole("button", {
                name: /Advies tekst\(en\) toevoegen/i,
            })
        );
        expect(screen.getByText(/AddNewAdvisoryText/i)).toBeInTheDocument();
    });

    it("Switches to the component AddNewCategory", () => {
        render(<CategoryMainScreen />);
        fireEvent.click(
            screen.getByRole("button", { name: /Voeg nieuwe categorie toe/i })
        );
        expect(screen.getByText(/AddNewCategory/i)).toBeInTheDocument();
    });

    it("Switches to the component AdvisoryTextManager", () => {
        render(<CategoryMainScreen />);
        fireEvent.click(screen.getByRole("button", { name: /Overzicht/i }));
        expect(screen.getByText(/AdvisoryTextManager/i)).toBeInTheDocument();
    });
});
