import { contextBridge, ipcRenderer } from "electron";
import { IPCEvents } from "./ipcTypes";

const listenToWindowCloseClosure = () => {
  let ipcRendererRef: Electron.IpcRenderer = null;
  return async (callback: () => void) => {
    if (ipcRendererRef) {
      ipcRendererRef.removeAllListeners(IPCEvents.SaveBeforeQuit);
    }
    ipcRendererRef = ipcRenderer.on(IPCEvents.SaveBeforeQuit, callback);
  };
};

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
  listenToWindowClose: listenToWindowCloseClosure(),
  quitProgram: () => {
    ipcRenderer.invoke(IPCEvents.Quit);
  },
});
