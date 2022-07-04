import { ipcMain } from "electron";

export type EventTypes =
  | "show-save-dialog"
  | "save-file"
  | "load-file-dialog"
  | "load-file"
  | "save-before-quit"
  | "quit"
  | "get-application-state"
  | "delete-file"
  | "save-settings"
  | "get-settings";

export const IPCEvents = {
  ShowSaveDialog: "show-save-dialog",
  SaveFile: "save-file",
  LoadFileDialog: "load-file-dialog",
  LoadFile: "load-file",
  SaveBeforeQuit: "save-before-quit",
  Quit: "quit",
  GetApplicationState: "get-application-state",
  DeleteFile: "delete-file",
  SaveSettings: "save-settings",
  GetSettings: "get-settings",
};

export interface ApplicationState {
  openedFilePath: string;
  scrollPosition: number;
  recentFiles: string[];
}

export interface ApplicationSettings {
  defaultLanguage: Languages;
}

export type Languages = "javascript" | "typescript";

export interface FileSettings {
  defaultLanguage: Languages;
}

export type IPCEventHandler = Parameters<typeof ipcMain.handle>[1];
