export type EventTypes =
  | "show-save-dialog"
  | "save-file"
  | "load-file-dialog"
  | "load-file"
  | "save-before-quit"
  | "quit"
  | "get-application-state"
  | "delete-file";

export const IPCEvents = {
  ShowSaveDialog: "show-save-dialog",
  SaveFile: "save-file",
  LoadFileDialog: "load-file-dialog",
  LoadFile: "load-file",
  SaveBeforeQuit: "save-before-quit",
  Quit: "quit",
  GetApplicationState: "get-application-state",
  DeleteFile: "delete-file",
};

export interface ApplicationState {
  openedFilePath: string;
  scrollPosition: number;
  recentFiles: string[];
}

export type Languages = "javascript" | "typescript";

export interface FileSettings {
  defaultLanguage: Languages;
}
