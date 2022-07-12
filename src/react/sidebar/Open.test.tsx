import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { addCell } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import Open from "./Open";

// it has been tested already, mock the entire thing for convenience
jest.mock("../hooks/useTryOpenFile", () => {
  const func = jest.fn();
  return {
    useTryOpenFile: () => ({
      startOpenFile: func,
    }),
  };
});

describe("Open button works", () => {
  beforeEach(() => {
    jest.mocked(useDisclosure().onOpen).mockReset();
    jest.mocked(useTryOpenFile().startOpenFile).mockReset();
  });

  it("calls hook if not touched", async () => {
    customRender(<Open />);
    const text = screen.getByText(/Open/);
    await userEvent.click(text);
    expect(useDisclosure().onOpen).not.toBeCalled();
    expect(useTryOpenFile().startOpenFile).toBeCalled();
  });

  it("opens a unsaved modal if it is touched", async () => {
    customRender(<Open />);
    // simulate an unsaved change
    act(() => {
      store.dispatch(addCell({ index: 0, type: "code" }));
    });
    const text = screen.getByText(/Open/);
    await userEvent.click(text);
    expect(useDisclosure().onOpen).toBeCalled();
    expect(useTryOpenFile().startOpenFile).not.toBeCalled();
  });
});
