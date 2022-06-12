import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type CellType = "code" | "markdown";

export interface CellContent {
  type: CellType;
  text: string;
}

export interface CellSlice {
  cells: CellContent[];
  title: string;
}

export type CellContentWithIndex = CellContent & { index: number };
export type CellTypeWithIndex = { type: CellType; index: number };

const initialState: CellSlice = {
  cells: [],
  title: "",
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
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
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
} = cellSlice.actions;

export const selectCells = (state: RootState) => state.cells.cells;
export const selectCellsLen = (state: RootState) => state.cells.cells.length;
export const selectTitle = (state: RootState) => state.cells.title;

export default cellSlice.reducer;
