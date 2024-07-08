import { Store } from "../lib/Store";
import { ApplicationSettings, IPCEventHandler } from "./ipcTypes";

export const getSettings: IPCEventHandler = async (
  _,
  settingsStore: Store<ApplicationSettings>
) => {
  try {
    const state = await settingsStore.open();
    console.log(state);
    console.log(settingsStore.getPath());
    return state;
  } catch (err) {
    return null;
  }
};
