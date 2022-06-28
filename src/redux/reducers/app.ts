import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationSettings } from "../../ipcTypes";
import { RootState } from "../store";

interface AppSlice {
  settings: ApplicationSettings;
}

const initialState: AppSlice = {
  settings: {
    defaultLanguage: "javascript",
  },
};

export const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    setSettings(state, { payload }: PayloadAction<ApplicationSettings>) {
      state.settings = payload;
    },
  },
});

export const { setSettings } = appSlice.actions;

export const selectAppSettings = (state: RootState) => state.app.settings;

export default appSlice.reducer;
