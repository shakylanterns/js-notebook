import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment } from "react";
import { openedFile } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import { useQuitProgram } from "./useQuitProgram";

describe("use quit program hook works", () => {
  const Wrapper = () => {
    const { quitProgram } = useQuitProgram();
    return (
      <Fragment>
        <button onClick={quitProgram}>Click</button>
      </Fragment>
    );
  };
  it("quits with the correct arguments", async () => {
    customRender(<Wrapper />);

    const btn = screen.getByText("Click");

    await userEvent.click(btn);

    expect(window.electron.quitProgram).toBeCalledWith({
      openedFilePath: "",
      scrollPosition: 0,
      recentFiles: [],
    });
  });

  it("quits with the file name if a file is opened", async () => {
    const FILENAME = "hello";
    customRender(<Wrapper />);

    act(() => {
      store.dispatch(
        openedFile({
          filePath: FILENAME,
          cells: [],
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });
    const btn = screen.getByText("Click");
    await userEvent.click(btn);

    expect(window.electron.quitProgram).toBeCalledWith({
      openedFilePath: FILENAME,
      scrollPosition: 0,
      recentFiles: [FILENAME],
    });
  });
});
