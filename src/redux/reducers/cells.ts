import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CellType = "code" | "markdown";

export interface CellContent {
  type: CellType;
  text: string;
}

export interface CellSlice {
  cells: CellContent[];
}

export type CellContentWithIndex = CellContent & { index: number };
export type CellTypeWithIndex = { type: CellType; index: number };

const initialState: CellSlice = {
  cells: [],
};

const cellSlice = createSlice({
  name: "cells",
  reducers: {
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
    },
    deleteCell(state, action: PayloadAction<number>) {
      if (action.payload < 0 || action.payload >= state.cells.length) {
        return;
      }
      // replace that position with nothing
      state.cells.splice(action.payload, 1);
    },
  },
  initialState,
});

export const { addCell, updateCell, deleteCell } = cellSlice.actions;

export const selectCells = (state: RootState) => state.cells.cells;

export default cellSlice.reducer;
