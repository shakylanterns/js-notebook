export type EventTypes =
  | "show-save-dialog"
  | "save-file"
  | "load-file-dialog"
  | "load-file"
  | "save-before-quit"
  | "quit"
  | "get-application-state";

export const IPCEvents = {
  ShowSaveDialog: "show-save-dialog",
  SaveFile: "save-file",
  LoadFileDialog: "load-file-dialog",
  LoadFile: "load-file",
  SaveBeforeQuit: "save-before-quit",
  Quit: "quit",
  GetApplicationState: "get-application-state",
};

export interface ApplicationState {
  openedFilePath: string;
  scrollPosition: number;
  recentFiles: string[];
}
