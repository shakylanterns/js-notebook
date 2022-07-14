import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { setTitle } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import DocumentTitle from "./DocumentTitle";

describe("document title shows itself correctly", () => {
  it("shows untitled if title is empty", () => {
    act(() => {
      store.dispatch(setTitle(""));
    });
    customRender(<DocumentTitle />);
    const elem = screen.getByText(/untitled/i);
    expect(elem).toBeInTheDocument();
  });

  it("allows user to edit", async () => {
    const title = "Hello World!";
    act(() => {
      store.dispatch(setTitle(""));
    });
    customRender(<DocumentTitle />);
    const elem = screen.getByText(/untitled/i);
    await userEvent.dblClick(elem);
    const input = screen.getByPlaceholderText(/title/i);
    await userEvent.type(input, title);
    expect(input).toHaveValue(title);
    // try to blur the input
    fireEvent.blur(input);
    const titleElem = screen.getByText(title);
    expect(titleElem).toBeInTheDocument();
  });
});
