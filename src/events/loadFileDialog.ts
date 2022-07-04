import { dialog } from "electron";
import { IPCEventHandler } from "./ipcTypes";

export const loadFileDialog: IPCEventHandler = async () => {
  return dialog.showOpenDialog({
    title: "Open Note",
    filters: [
      {
        extensions: ["jsnote.json", "jsnote"],
        name: "JS Notebook File",
      },
    ],
    properties: ["showHiddenFiles"],
  });
};
