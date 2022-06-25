import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileSettings } from "../../ipcTypes";
import { RootState } from "../store";

export type CellType = "code" | "markdown";

export interface CellContent {
  type: CellType;
  text: string;
}

export interface NoteFile {
  title: string;
  cells: CellContent[];
  settings: FileSettings;
}

export type NoteFileWithPath = NoteFile & { filePath: string };

export interface CellSlice {
  cells: CellContent[];
  title: string;
  filePath: string;
  touched: boolean;
  fileError: string;
  hasEditorOpened: boolean;
  recentFiles: string[];
  settings: FileSettings | null;
}

export type CellContentWithIndex = CellContent & { index: number };
export type CellTypeWithIndex = { type: CellType; index: number };

export interface SaveFileOptions {
  content: string;
  ignoreCurrentFilePath?: boolean;
  filePath?: string;
}

const initialState: CellSlice = {
  cells: [],
  title: "",
  filePath: "",
  fileError: "",
  touched: false,
  hasEditorOpened: false,
  recentFiles: [],
  settings: null,
};

const cellSlice = createSlice({
  name: "cells",
  reducers: {
    shiftCellBefore(state, action: PayloadAction<number>) {
      // remove that element
      const collected = state.cells.splice(action.payload, 1);
      // something went wrong if there is nothing
      if (collected.length !== 1) {
        return;
      }
      // add before the previous element
      state.cells.splice(action.payload - 1, 0, collected[0]);
      state.touched = true;
    },
    shiftCellAfter(state, action: PayloadAction<number>) {
      // remove that element
      const collected = state.cells.splice(action.payload, 1);
      // something went wrong if there is nothing
      if (collected.length !== 1) {
        return;
      }
      // add before the previous element
      state.cells.splice(action.payload + 1, 0, collected[0]);
      state.touched = true;
    },
    addCell(state, action: PayloadAction<CellTypeWithIndex>) {
      const { index, type } = action.payload;
      if (index < 0 || index > state.cells.length) {
        return;
      }
      // insert that slice to the position of index
      state.cells.splice(index, 0, {
        type,
        text: "",
      });
      state.touched = true;
    },
    updateCell(state, action: PayloadAction<CellContentWithIndex>) {
      const { index, text, type } = action.payload;
      if (index < 0 || index > state.cells.length) {
        return;
      }
      // replace that slice with the new slice
      state.cells.splice(index, 1, {
        type,
        text,
      });
      state.touched = true;
    },
    deleteCell(state, action: PayloadAction<number>) {
      if (action.payload < 0 || action.payload >= state.cells.length) {
        return;
      }
      // replace that position with nothing
      state.cells.splice(action.payload, 1);
      state.touched = true;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
      state.touched = true;
    },
    setFilePath(state, action: PayloadAction<string>) {
      state.filePath = action.payload;
    },
    closeEditor(state) {
      state.hasEditorOpened = false;
      state.filePath = "";
      state.fileError = "";
      state.touched = false;
    },
    startEditor(state) {
      state.hasEditorOpened = true;
      state.filePath = "";
      state.fileError = "";
      state.touched = true;
    },
    setRecentFiles(state, action: PayloadAction<string[]>) {
      state.recentFiles = action.payload;
    },
    addRecentFile(state, action: PayloadAction<string>) {
      state.recentFiles.push(action.payload);
    },
    removeRecentFile(state, action: PayloadAction<string>) {
      state.recentFiles = state.recentFiles.filter((n) => n !== action.payload);
    },
    openedFile(state, action: PayloadAction<NoteFileWithPath>) {
      const file = action.payload;
      state.filePath = file.filePath;
      state.cells = file.cells;
      state.title = file.title;
      state.touched = false;
      state.fileError = "";
      state.hasEditorOpened = true;
      state.settings = file.settings;
      const found =
        state.recentFiles.findIndex((rf) => rf === file.filePath) !== -1;
      if (!found) {
        state.recentFiles.unshift(file.filePath);
      }
    },
    savedFile(state, { payload }: PayloadAction<string>) {
      state.filePath = payload;
      state.touched = false;
      state.fileError = "";
      const found = state.recentFiles.findIndex((rf) => rf === payload) !== -1;
      if (!found) {
        state.recentFiles.unshift(payload);
      }
    },
    deleteNote(state, { payload }: PayloadAction<string>) {
      state.filePath = "";
      state.touched = false;
      state.fileError = "";
      state.hasEditorOpened = false;
      state.cells = [];
      state.title = "";
      state.recentFiles = state.recentFiles.filter((rf) => rf !== payload);
      state.settings = null;
    },
    setFileSettings(state, { payload }: PayloadAction<FileSettings>) {
      state.settings = payload;
    },
    setFileError(state, action: PayloadAction<string>) {
      state.fileError = action.payload;
    },
  },
  initialState,
});

export const {
  addCell,
  updateCell,
  deleteCell,
  shiftCellAfter,
  shiftCellBefore,
  setTitle,
  setFilePath,
  closeEditor,
  startEditor,
  setRecentFiles,
  addRecentFile,
  setFileError,
  openedFile,
  savedFile,
  removeRecentFile,
  deleteNote,
  setFileSettings,
} = cellSlice.actions;

export const selectCells = (state: RootState) => state.cells.cells;
export const selectCellsLen = (state: RootState) => state.cells.cells.length;
export const selectTitle = (state: RootState) => state.cells.title;
export const selectFilePath = (state: RootState) => state.cells.filePath;
export const selectIsFileTouched = (state: RootState) => state.cells.touched;
export const selectFileError = (state: RootState) => state.cells.fileError;
export const selectHasEditorOpened = (state: RootState) =>
  state.cells.hasEditorOpened;
export const selectRecentFiles = (state: RootState) => state.cells.recentFiles;
export const selectFileSettings = (state: RootState) => state.cells.settings;

export default cellSlice.reducer;
