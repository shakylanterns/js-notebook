import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CellType = "code" | "markdown";

export interface CellContent {
  type: CellType;
  text: string;
}

export interface CellSlice {
  cells: CellContent[];
  title: string;
  filePath: string;
  touched: boolean;
  fileError: string;
  hasEditorOpened: boolean;
  recentFiles: string[];
}

export type CellContentWithIndex = CellContent & { index: number };
export type CellTypeWithIndex = { type: CellType; index: number };

export interface SaveFileOptions {
  content: string;
  ignoreCurrentFilePath?: boolean;
}

export const saveFile = createAsyncThunk.withTypes<{
  state: RootState;
}>()(
  "cells/saveFile",
  async (
    { content, ignoreCurrentFilePath }: SaveFileOptions,
    { rejectWithValue, getState }
  ) => {
    let cellFilePath = getState().cells.filePath;
    if (ignoreCurrentFilePath || !cellFilePath) {
      const { canceled, filePath } = await window.electron.getSaveFilePath();
      if (canceled) {
        return rejectWithValue("cancelled");
      }
      cellFilePath =
        !filePath.endsWith(".jsnote") && !filePath.endsWith(".jsnote.json")
          ? filePath + ".jsnote"
          : filePath;
    }
    const error = await window.electron.saveFile(cellFilePath, content);
    if (error) {
      return rejectWithValue(error);
    }
    return cellFilePath;
  }
);

export interface OpenFileOptions {
  filePath?: string;
}

export const openFile = createAsyncThunk(
  "cells/openFile",
  async ({ filePath }: OpenFileOptions, { rejectWithValue }) => {
    let _filePath = filePath;
    if (!filePath) {
      const { canceled, filePaths } = await window.electron.loadFilePath();
      if (canceled) {
        return rejectWithValue("cancelled");
      }
      _filePath = filePaths[0];
    }
    const { error, content } = await window.electron.loadFile(_filePath);
    if (error) {
      return rejectWithValue(error);
    }
    return {
      filePath: _filePath,
      content,
    };
  }
);

const initialState: CellSlice = {
  cells: [],
  title: "",
  filePath: "",
  fileError: "",
  touched: false,
  hasEditorOpened: false,
  recentFiles: [],
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
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(saveFile.fulfilled, (state, { payload }) => {
      state.filePath = payload;
      state.touched = false;
      state.fileError = "";
    });

    builder.addCase(saveFile.rejected, (state, action) => {
      state.fileError = action.payload as string;
    });

    builder.addCase(openFile.fulfilled, (state, { payload }) => {
      state.filePath = payload.filePath;
      try {
        const items = JSON.parse(payload.content);
        if (typeof items.title !== "string") {
          throw new Error("Parse Error: Document title is malformed");
        }
        if (!(items.cells instanceof Array)) {
          throw new Error("Parse Error: Cells field is not an array");
        }
        items.cells.forEach((cell: Partial<CellContent>) => {
          if (
            !cell.type ||
            (cell.type !== "markdown" && cell.type !== "code")
          ) {
            throw new Error("Parse Error: Cell type is invalid");
          }
          if (!cell.text) {
            throw new Error("Parse Error: Cell has no text");
          }
        });
        state.cells = items.cells;
        state.title = items.title;
        state.touched = false;
        state.fileError = "";
        state.hasEditorOpened = true;
      } catch (err) {
        state.fileError = err.message;
      }
    });

    builder.addCase(openFile.rejected, (state, action) => {
      state.fileError = action.payload as string;
    });
  },
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

export default cellSlice.reducer;
