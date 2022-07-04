import { ipcMain } from "electron";
import { Store } from "../lib/Store";
import { deleteFile } from "./deleteFile";
import { getApplicationState } from "./getApplicationState";
import { getSettings } from "./getSettings";
import {
  ApplicationSettings,
  ApplicationState,
  IPCEventHandler,
  IPCEvents,
} from "./ipcTypes";
import { loadFile } from "./loadFile";
import { loadFileDialog } from "./loadFileDialog";
import { quit } from "./quit";
import { saveFile } from "./saveFile";
import { saveSettings } from "./saveSettings";
import { showSaveDialog } from "./showSaveDialog";

export class IPCEventsRegistry {
  public isQuitting = false;
  public stateStore = new Store<ApplicationState>("state");
  public settingsStore = new Store<ApplicationSettings>("settings");

  private quitWrapper: IPCEventHandler = (_, state: ApplicationState) => {
    return quit(_, state, () => (this.isQuitting = true), this.stateStore);
  };

  private getSettingsWrapper: IPCEventHandler = (_) => {
    return getSettings(_, this.stateStore);
  };

  private saveSettingsWrapper: IPCEventHandler = (
    _,
    state: ApplicationState
  ) => {
    return saveSettings(_, state, this.stateStore);
  };

  private getApplicationStateWrapper: IPCEventHandler = (_) => {
    return getApplicationState(_, this.stateStore);
  };

  private events = {
    [IPCEvents.ShowSaveDialog]: showSaveDialog,
    [IPCEvents.SaveFile]: saveFile,
    [IPCEvents.LoadFileDialog]: loadFileDialog,
    [IPCEvents.LoadFile]: loadFile,
    [IPCEvents.Quit]: this.quitWrapper,
    [IPCEvents.GetApplicationState]: this.getApplicationStateWrapper,
    [IPCEvents.DeleteFile]: deleteFile,
    [IPCEvents.GetSettings]: this.getSettingsWrapper,
    [IPCEvents.SaveSettings]: this.saveSettingsWrapper,
  };

  constructor() {
    Object.entries(this.events).forEach(([name, handler]) => {
      ipcMain.handle(name, handler);
    });
  }
}
