import { useToast } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom";
import { openedFile } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import SettingsScreen, { notificationObjects } from "./SettingsScreen";

describe("settings screen works", () => {
  beforeEach(() => {
    jest.mocked(window.electron.saveSettings).mockReset();
    jest.mocked(useToast()).mockReset();
  });

  it("go back to editor when clicked", async () => {
    // simulate editor opened
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: "hi",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });

    customRender(<SettingsScreen />);
    const btn = screen.getByText(/go back/i);
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(useNavigate()).toBeCalledWith("/editor");
  });

  it("saves settings when clicked", async () => {
    // save success
    jest.mocked(window.electron.saveSettings).mockResolvedValue(true);
    // simulate editor opened
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: "hi",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });

    customRender(<SettingsScreen />);
    const btn = screen.getByText(/save settings/i);
    await userEvent.click(btn);
    expect(window.electron.saveSettings).toBeCalled();
    expect(useToast()).toBeCalledWith(notificationObjects.saved);
  });

  it("show error when not saved", async () => {
    // save success
    jest.mocked(window.electron.saveSettings).mockResolvedValue(false);
    // simulate editor opened
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: "hi",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });

    customRender(<SettingsScreen />);
    const btn = screen.getByText(/save settings/i);
    await userEvent.click(btn);
    expect(window.electron.saveSettings).toBeCalled();
    expect(useToast()).toBeCalledWith(notificationObjects.failed);
  });
});
