import { app } from "electron";
import { Store } from "../lib/Store";
import { ApplicationState, IPCEventHandler } from "./ipcTypes";

export const quit: IPCEventHandler = async (
  _,
  state: ApplicationState,
  setQuit: () => void,
  stateStore: Store<ApplicationState>
) => {
  try {
    await stateStore.save(state);
  } catch (err) {
    /* empty */
  } finally {
    setQuit();
    app.quit();
  }
};
