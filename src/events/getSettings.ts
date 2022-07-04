import { Store } from "../lib/Store";
import { ApplicationSettings, IPCEventHandler } from "./ipcTypes";

export const getSettings: IPCEventHandler = async (
  _,
  settingsStore: Store<ApplicationSettings>
) => {
  try {
    const state = await settingsStore.open();
    return state;
  } catch (err) {
    return null;
  }
};
