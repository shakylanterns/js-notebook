import { Store } from "../lib/Store";
import { ApplicationSettings, IPCEventHandler } from "./ipcTypes";

export const saveSettings: IPCEventHandler = async (
  _,
  settings: ApplicationSettings,
  settingsStore: Store<ApplicationSettings>
) => {
  try {
    await settingsStore.save(settings);
    return true;
  } catch (_1) {
    return false;
  }
};
