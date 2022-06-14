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
}

export type CellContentWithIndex = CellContent & { index: number };
export type CellTypeWithIndex = { type: CellType; index: number };

export const saveFile = createAsyncThunk.withTypes<{
  state: RootState;
}>()(
  "cells/saveFile",
  async (contents: string, { rejectWithValue, getState }) => {
    let cellFilePath = getState().cells.filePath;
    if (!cellFilePath) {
      const { canceled, filePath } = await window.electron.getSaveFilePath();
      if (canceled) {
        return;
      }
      cellFilePath =
        !filePath.endsWith(".jsnote") && !filePath.endsWith(".jsnote.json")
          ? filePath + ".jsnote"
          : filePath;
    }
    const error = await window.electron.saveFile(cellFilePath, contents);
    if (error) {
      rejectWithValue(error);
    }
    return cellFilePath;
  }
);

export const openFile = createAsyncThunk(
  "cells/openFile",
  async (_, { rejectWithValue }) => {
    const { canceled, filePaths } = await window.electron.loadFilePath();
    if (canceled) {
      return;
    }
    const { error, content } = await window.electron.loadFile(filePaths[0]);
    if (error) {
      rejectWithValue(error);
    }
    return {
      filePath: filePaths[0],
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
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(saveFile.fulfilled, (state, { payload }) => {
      state.filePath = payload;
      state.touched = false;
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
} = cellSlice.actions;

export const selectCells = (state: RootState) => state.cells.cells;
export const selectCellsLen = (state: RootState) => state.cells.cells.length;
export const selectTitle = (state: RootState) => state.cells.title;
export const selectFilePath = (state: RootState) => state.cells.filePath;
export const selectFileError = (state: RootState) => state.cells.fileError;

export default cellSlice.reducer;
