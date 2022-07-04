import { Store } from "../lib/Store";
import { ApplicationState, IPCEventHandler } from "./ipcTypes";

export const getApplicationState: IPCEventHandler = async (
  _,
  stateStore: Store<ApplicationState>
) => {
  try {
    const state = await stateStore.open();
    return state;
  } catch (err) {
    return null;
  }
};
