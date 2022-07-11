import { useToast } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { customRender } from "../../test-utils/customRennder";
import {
  notificationObjects,
  openFile,
  OpenFileOptions,
  parseContent,
  useTryOpenFile,
} from "./useTryOpenFile";

describe("parse content", () => {
  it("parses correct format", () => {
    const noteFile = { title: "Hi", cells: [{ text: "", type: "code" }] };
    const content = JSON.stringify(noteFile);
    const output = parseContent(content);
    expect(output).toEqual(noteFile);
  });

  it("throws title error when title is not present", () => {
    const noteFile = { cells: [{ text: "", type: "code" }] };
    const content = JSON.stringify(noteFile);
    expect(() => parseContent(content)).toThrowError(/title/);
  });

  it("throws cells error when cell is not an array", () => {
    const noteFile = { title: "", cells: {} };
    const content = JSON.stringify(noteFile);
    expect(() => parseContent(content)).toThrowError(/array/);
  });

  it("throws cell type error when the type is not code or markdown", () => {
    const noteFile = { title: "", cells: [{ text: "", type: "hello" }] };
    const content = JSON.stringify(noteFile);
    expect(() => parseContent(content)).toThrowError(/type/);
  });

  it("throws text error when a cell doesn't have text field", () => {
    const noteFile = { title: "", cells: [{ type: "code" }] };
    const content = JSON.stringify(noteFile);
    expect(() => parseContent(content)).toThrowError(/text/);
  });
});

describe("open file function", () => {
  it("prompts the user when file path is empty", async () => {
    jest.mocked(window.electron.loadFilePath).mockResolvedValue({
      canceled: false,
      filePaths: ["hello.json"],
    });
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: undefined,
      content: "",
    });

    // calling openFile with nothing
    await openFile({});

    expect(window.electron.loadFilePath).toBeCalled();
  });

  it("reads a file successfully", async () => {
    const content = "hello world!";
    const filePath = "test.json";
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: undefined,
      content,
    });

    const { content: resultContent, filePath: resultFilePath } = await openFile(
      { filePath }
    );
    expect(resultContent).toEqual(content);
    expect(resultFilePath).toEqual(filePath);
  });

  it("throws error if file dialog cancelled", async () => {
    expect.assertions(1);
    jest.mocked(window.electron.loadFilePath).mockResolvedValue({
      canceled: true,
      filePaths: [],
    });
    try {
      await openFile({});
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("throws error if file cannot be read", async () => {
    expect.assertions(1);
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: "reading error!",
      content: "",
    });
    try {
      await openFile({ filePath: "any" });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

describe("useTryOpenFile hook works", () => {
  beforeEach(() => {
    jest.mocked(useNavigate()).mockReset();
    jest.mocked(useToast()).mockReset();
  });

  const Wrapper = (props: OpenFileOptions) => {
    const { startOpenFile } = useTryOpenFile();
    return (
      <Fragment>
        <button onClick={() => startOpenFile(props)}>Click</button>
      </Fragment>
    );
  };

  it("calls toast and navigate if file is vaild", async () => {
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: undefined,
      content: JSON.stringify({ title: "", cells: [] }),
    });
    customRender(<Wrapper filePath="hi" />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);

    expect(useNavigate()).toBeCalledWith("/editor");
    expect(useToast()).toBeCalledWith(notificationObjects.opened);
  });

  it("calls error toast file is deleted", async () => {
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: "ENOENT",
      content: "",
    });
    customRender(<Wrapper filePath="hi" />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);

    expect(useNavigate()).not.toBeCalled();
    expect(useToast()).toBeCalledWith(notificationObjects.deleted);
  });

  it("calls malformed toast file is deleted", async () => {
    jest.mocked(window.electron.loadFile).mockResolvedValue({
      error: "some random format error",
      content: "",
    });
    customRender(<Wrapper filePath="hi" />);
    const btn = screen.getByText("Click");
    await userEvent.click(btn);

    expect(useNavigate()).not.toBeCalled();
    expect(useToast()).toBeCalledWith(notificationObjects.malformed);
  });
});
