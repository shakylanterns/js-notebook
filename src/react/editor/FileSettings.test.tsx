import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import {
  addCell,
  openedFile,
  selectIsFileTouched,
} from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import FileSettings from "./FileSettings";

jest.mock("../hooks/useTrySaveFile", () => {
  const func = jest.fn();
  return {
    useTrySaveFile: () => ({
      startSaveFile: func,
    }),
  };
});

describe("file settings button works", () => {
  // force restore the original useDisclosure hook
  // probably very bad testing code
  const originalChakra = jest.requireActual("@chakra-ui/react");
  jest.mocked(useDisclosure).mockImplementation(originalChakra.useDisclosure);

  it("shows modal when clicked", async () => {
    customRender(<FileSettings />);
    const btn = screen.getByText(/file settings/i);
    await userEvent.click(btn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("saves file when filepath exists", async () => {
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: "hello.jsnote",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });
    customRender(<FileSettings />);
    const btn = screen.getByText(/file settings/i);
    await userEvent.click(btn);
    const save = screen.getByText(/save settings/i);
    await userEvent.click(save);
    // after saving, it should not be touched
    expect(selectIsFileTouched(store.getState())).toBe(false);
  });

  it("does not save file when filepath does not exist", async () => {
    act(() => {
      // force it to be touched
      store.dispatch(addCell({ index: 0, type: "code" }));
    });
    customRender(<FileSettings />);
    const btn = screen.getByText(/file settings/i);
    await userEvent.click(btn);
    const save = screen.getByText(/save settings/i);
    await userEvent.click(save);
    expect(selectIsFileTouched(store.getState())).toBe(true);
  });
});
