export type EventTypes =
  | "show-save-dialog"
  | "save-file"
  | "load-file-dialog"
  | "load-file"
  | "save-before-quit"
  | "quit";

export const IPCEvents = {
  ShowSaveDialog: "show-save-dialog",
  SaveFile: "save-file",
  LoadFileDialog: "load-file-dialog",
  LoadFile: "load-file",
  SaveBeforeQuit: "save-before-quit",
  Quit: "quit",
};
