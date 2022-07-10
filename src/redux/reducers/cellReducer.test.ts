import { configureStore } from "@reduxjs/toolkit";
import { FileSettings } from "../../events/ipcTypes";
import appReducer from "./app";
import cellReducer, {
  addCell,
  addRecentFile,
  closeEditor,
  deleteCell,
  deleteNote,
  initialState,
  NoteFile,
  openedFile,
  removeRecentFile,
  savedFile,
  selectCells,
  selectCellsLen,
  selectFileError,
  selectFilePath,
  selectFileSettings,
  selectHasEditorOpened,
  selectIsFileTouched,
  selectRecentFiles,
  selectTitle,
  setFileError,
  setFilePath,
  setFileSettings,
  setRecentFiles,
  setTitle,
  shiftCellAfter,
  shiftCellBefore,
  startEditor,
  updateCell,
} from "./cells";

describe("cell reducer works", () => {
  function getNewStore() {
    return configureStore({ reducer: { app: appReducer, cells: cellReducer } });
  }
  let testStore = getNewStore();
  let state = { ...initialState };
  beforeEach(() => {
    // reset the store
    testStore = getNewStore();
    state = { ...initialState };
  });

  it("add cell", () => {
    testStore.dispatch(addCell({ index: 0, type: "code" }));
    state.cells = [{ text: "", type: "code" }];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
    expect(selectCellsLen(testStore.getState())).toEqual(state.cells.length);
  });

  it("adds cell before", () => {
    testStore.dispatch(addCell({ index: 0, type: "code" }));
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    state.cells = [
      { text: "", type: "markdown" },
      { text: "", type: "code" },
    ];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
    expect(selectCellsLen(testStore.getState())).toEqual(state.cells.length);
  });

  it("adds cell after", () => {
    testStore.dispatch(addCell({ index: 0, type: "code" }));
    testStore.dispatch(addCell({ index: 1, type: "markdown" }));
    state.cells = [
      { text: "", type: "code" },
      { text: "", type: "markdown" },
    ];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
    expect(selectCellsLen(testStore.getState())).toEqual(state.cells.length);
  });

  it("adds cell at invalid positions", () => {
    testStore.dispatch(addCell({ index: 1000, type: "code" }));
    testStore.dispatch(addCell({ index: -111, type: "markdown" }));
    state.cells = [];
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("updates cell", () => {
    testStore.dispatch(addCell({ index: 0, type: "code" }));
    testStore.dispatch(updateCell({ index: 0, text: "hi", type: "markdown" }));
    state.cells = [{ text: "hi", type: "markdown" }];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
  });

  it("does not update cells if the position is invalid", () => {
    testStore.dispatch(updateCell({ index: -1, text: "hi", type: "markdown" }));
    testStore.dispatch(
      updateCell({ index: 1000, text: "hi", type: "markdown" })
    );
    state.cells = [];
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("deletes cell", () => {
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    testStore.dispatch(addCell({ index: 1, type: "code" }));
    testStore.dispatch(deleteCell(0));
    state.cells = [{ type: "code", text: "" }];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectCellsLen(testStore.getState())).toEqual(state.cells.length);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
  });

  it("does not delete cell that does not exist", () => {
    testStore.dispatch(deleteCell(100));
    state.cells = [];
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("shift cell before", () => {
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    testStore.dispatch(addCell({ index: 1, type: "code" }));
    testStore.dispatch(shiftCellBefore(1));
    state.cells = [
      { type: "code", text: "" },
      { type: "markdown", text: "" },
    ];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("does not shift if there is nothing in front", () => {
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    testStore.dispatch(shiftCellBefore(0));
    state.cells = [{ type: "markdown", text: "" }];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
  });

  it("shift before at invalid places should do nothing", () => {
    testStore.dispatch(shiftCellBefore(-111));
    testStore.dispatch(shiftCellBefore(111));
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("shift cell after", () => {
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    testStore.dispatch(addCell({ index: 1, type: "code" }));
    testStore.dispatch(shiftCellAfter(0));
    state.cells = [
      { type: "code", text: "" },
      { type: "markdown", text: "" },
    ];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
    expect(selectIsFileTouched(testStore.getState())).toEqual(state.touched);
  });

  it("shift after at invalid places should do nothing", () => {
    testStore.dispatch(shiftCellAfter(111));
    testStore.dispatch(shiftCellAfter(-111));
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("does not shift if there is nothing in the back", () => {
    testStore.dispatch(addCell({ index: 0, type: "markdown" }));
    testStore.dispatch(shiftCellAfter(0));
    state.cells = [{ type: "markdown", text: "" }];
    state.touched = true;
    expect(selectCells(testStore.getState())).toEqual(state.cells);
  });

  it("adds to recent files if it is not in the list", () => {
    testStore.dispatch(addRecentFile("index.json"));
    state.recentFiles = ["index.json"];
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
  });

  it("does not add to recent files if it is in the list already", () => {
    testStore.dispatch(addRecentFile("index.json"));
    testStore.dispatch(addRecentFile("index.json"));
    state.recentFiles = ["index.json"];
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
  });

  it("starts and closes editor properly", () => {
    // start editor
    testStore.dispatch(startEditor());
    state.hasEditorOpened = true;
    state.touched = true;
    expect(selectHasEditorOpened(testStore.getState())).toEqual(
      state.hasEditorOpened
    );

    // close editor
    testStore.dispatch(closeEditor());
    state.hasEditorOpened = false;
    state.touched = false;
    expect(selectHasEditorOpened(testStore.getState())).toEqual(
      state.hasEditorOpened
    );
  });

  it("overwrites recent files with empty argument", () => {
    testStore.dispatch(addRecentFile("index.json"));
    testStore.dispatch(addRecentFile("hi.json"));
    testStore.dispatch(setRecentFiles());
    state.recentFiles = [];
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
  });

  it("overwrites recent files with something argument", () => {
    testStore.dispatch(addRecentFile("index.json"));
    testStore.dispatch(addRecentFile("hi.json"));
    testStore.dispatch(setRecentFiles(["okay.json"]));
    state.recentFiles = ["okay.json"];
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
  });

  it("sets title", () => {
    const title = "Hello World";
    testStore.dispatch(setTitle(title));
    state.title = title;
    state.touched = true;
    expect(selectTitle(testStore.getState())).toEqual(state.title);
  });

  it("sets file error", () => {
    const error = "Cannot open file!";
    testStore.dispatch(setFileError(error));
    state.fileError = error;
    expect(selectFileError(testStore.getState())).toEqual(state.fileError);
  });

  it("sets file path", () => {
    const path = "/home/dummy/file.json";
    testStore.dispatch(setFilePath(path));
    state.filePath = path;
    expect(selectFilePath(testStore.getState())).toEqual(state.filePath);
  });

  it("sets file settings", () => {
    const newSettings: FileSettings = {
      defaultLanguage: "javascript",
    };
    testStore.dispatch(setFileSettings(newSettings));
    state.settings = newSettings;
    expect(selectFileSettings(testStore.getState())).toEqual(state.settings);
  });

  it("remove recent files", () => {
    testStore.dispatch(addRecentFile("index.json"));
    testStore.dispatch(addRecentFile("hi.json"));
    // removing first file
    state.recentFiles = ["index.json"];
    testStore.dispatch(removeRecentFile("hi.json"));
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
    // remove the second file
    state.recentFiles = [];
    testStore.dispatch(removeRecentFile("index.json"));
    expect(selectRecentFiles(testStore.getState())).toEqual(state.recentFiles);
  });

  it("opened file", () => {
    const noteFile: NoteFile = {
      cells: [{ type: "code", text: "console.log()" }],
      title: "Testing",
      settings: { defaultLanguage: "javascript" },
    };
    const filePath = "/home/dummy/hi.json";

    testStore.dispatch(
      openedFile({
        ...noteFile,
        filePath,
      })
    );

    state.cells = noteFile.cells;
    state.title = noteFile.title;
    state.settings = noteFile.settings;
    state.filePath = filePath;
    state.hasEditorOpened = true;
    state.recentFiles = [filePath];

    expect(testStore.getState().cells).toEqual(state);
  });

  it("saved file", () => {
    const filePath = "/home/dummy/hi.json";
    testStore.dispatch(savedFile(filePath));

    state.touched = false;
    state.recentFiles = [filePath];
    state.fileError = "";
    state.filePath = filePath;

    expect(testStore.getState().cells).toEqual(state);
  });

  it("deletes note", () => {
    const filePath = "/home/dummy/hi.json";
    testStore.dispatch(addRecentFile(filePath));
    testStore.dispatch(setFileSettings({ defaultLanguage: "javascript" }));
    testStore.dispatch(addCell({ index: 0, type: "code" }));
    testStore.dispatch(deleteNote(filePath));

    // it should be the same as the initial state
    expect(testStore.getState().cells).toEqual(state);
  });
});
