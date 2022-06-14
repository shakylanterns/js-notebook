import { contextBridge, ipcRenderer } from "electron";
import { IPCEvents } from "./ipcTypes";

contextBridge.exposeInMainWorld("electron", {
  getSaveFilePath: () => {
    return ipcRenderer.invoke(IPCEvents.ShowSaveDialog);
  },
  saveFile: async (filePath: string, fileContent: string) => {
    return ipcRenderer.invoke(IPCEvents.SaveFile, filePath, fileContent);
  },
  loadFilePath: async () => {
    return ipcRenderer.invoke(IPCEvents.LoadFileDialog);
  },
  loadFile: async (filePath: string) => {
    return ipcRenderer.invoke(IPCEvents.LoadFile, filePath);
  },
});
