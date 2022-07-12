import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom";
import { addCell } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import Home from "./Home";

describe("Home button works", () => {
  beforeEach(() => {
    jest.mocked(useDisclosure().onOpen).mockReset();
    jest.mocked(useNavigate()).mockReset();
  });

  it("goes back to home page if no unsaved changes", async () => {
    customRender(<Home />);
    const text = screen.getByText("Home");
    await userEvent.click(text);
    expect(useDisclosure().onOpen).not.toBeCalled();
    expect(useNavigate()).toBeCalledWith("/");
  });

  it("does not go back if file has unsaved changes", async () => {
    customRender(<Home />);
    // simulate an unsaved change
    act(() => {
      store.dispatch(addCell({ index: 0, type: "code" }));
    });
    const text = screen.getByText("Home");
    await userEvent.click(text);
    expect(useDisclosure().onOpen).toBeCalled();
    expect(useNavigate()).not.toBeCalled();
  });
});
