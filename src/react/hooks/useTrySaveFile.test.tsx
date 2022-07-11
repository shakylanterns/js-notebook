import { useToast } from "@chakra-ui/react";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment } from "react";
import { NoteFile, openedFile } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import {
  notificationObject,
  saveFile,
  StartSaveFileOptions,
  useTrySaveFile,
} from "./useTrySaveFile";

describe("save file", () => {
  it("should return file path if the file can be saved", async () => {
    const filename = "test.jsnote";
    jest.mocked(window.electron.saveFile).mockResolvedValue("");
    const result = await saveFile({
      content: "",
      filePath: filename,
      ignoreCurrentFilePath: false,
    });
    expect(result).toBe(filename);
  });

  it("should append .jsnote if the filename does not have any extensions", async () => {
    const filename = "test";
    jest.mocked(window.electron.saveFile).mockResolvedValue("");
    const result = await saveFile({
      content: "",
      filePath: filename,
      ignoreCurrentFilePath: false,
    });
    expect(result).toBe(filename + ".jsnote");
  });

  it("throws error if cancelled", async () => {
    jest.mocked(window.electron.saveFile).mockResolvedValue("");
    jest.mocked(window.electron.getSaveFilePath).mockResolvedValue({
      canceled: true,
    });
    try {
      await saveFile({ content: "", ignoreCurrentFilePath: true });
    } catch (err) {
      expect(err).toEqual(new Error("cancelled"));
    }
  });

  it("throws error if cannot be saved", async () => {
    const error = "save error";
    jest.mocked(window.electron.saveFile).mockResolvedValue(error);
    jest.mocked(window.electron.getSaveFilePath).mockResolvedValue({
      canceled: false,
      filePath: "",
    });
    try {
      await saveFile({
        content: "",
        filePath: "test",
        ignoreCurrentFilePath: false,
      });
    } catch (err) {
      expect(err).toEqual(new Error(error));
    }
  });
});

describe("use try save file hook works", () => {
  beforeEach(() => {
    jest.mocked(useToast()).mockReset();
  });

  const Wrapper = (props: StartSaveFileOptions) => {
    const { startSaveFile } = useTrySaveFile();
    return (
      <Fragment>
        <button onClick={() => startSaveFile(props)}>Click</button>
      </Fragment>
    );
  };

  // dummy values
  const filePath = "hi.jsnote";
  const noteFile: NoteFile = {
    cells: [
      {
        text: "",
        type: "code",
      },
    ],
    settings: {
      defaultLanguage: "javascript",
    },
    title: "Hello World!",
  };

  const noteFileWithOptions = {
    ...noteFile,
    filePath,
    ignoreCurrentFilePath: false,
  };

  it("saves correctly", async () => {
    // empty string denotes no error message
    jest.mocked(window.electron.saveFile).mockResolvedValue("");
    customRender(<Wrapper {...noteFileWithOptions} />);
    act(() => {
      // simulate file open and populate the slice state
      store.dispatch(openedFile(noteFileWithOptions));
    });
    const btn = screen.getByText("Click");
    await userEvent.click(btn);
    expect(useToast()).toBeCalledWith(notificationObject.saved);
  });

  it("does not call toast when cancelled", async () => {
    jest
      .mocked(window.electron.saveFile)
      .mockRejectedValue(new Error("cancelled"));
    customRender(<Wrapper {...noteFileWithOptions} />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);
    expect(useToast()).not.toBeCalled();
  });

  it("calls notExist notification when the err msg starts with ENOENT", async () => {
    jest
      .mocked(window.electron.saveFile)
      .mockRejectedValue(new Error("ENOENT"));
    customRender(<Wrapper {...noteFileWithOptions} />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);
    expect(useToast()).toBeCalledWith(notificationObject.notExist);
  });

  it("calls generic notification when err msg not ENOENT", async () => {
    const message = "random message";
    jest.mocked(window.electron.saveFile).mockRejectedValue(new Error(message));
    customRender(<Wrapper {...noteFileWithOptions} />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);
    expect(useToast()).toBeCalledWith(
      notificationObject.otherErrors(new Error(message))
    );
  });
});
