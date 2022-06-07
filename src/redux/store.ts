import { configureStore } from "@reduxjs/toolkit";
import cells from "./reducers/cells";

export const store = configureStore({
  reducer: {
    cells,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
