import { dialog } from "electron";
import { IPCEventHandler } from "./ipcTypes";

export const showSaveDialog: IPCEventHandler = () => {
  return dialog.showSaveDialog({
    title: "Save Note",
    filters: [
      {
        extensions: ["jsnote.json", "jsnote"],
        name: "JS Notebook File",
      },
    ],
    properties: [
      "showHiddenFiles",
      "showOverwriteConfirmation",
      "createDirectory",
    ],
  });
};
