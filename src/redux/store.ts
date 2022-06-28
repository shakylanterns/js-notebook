import { configureStore } from "@reduxjs/toolkit";
import app from "./reducers/app";
import cells from "./reducers/cells";

export const store = configureStore({
  reducer: {
    app,
    cells,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
