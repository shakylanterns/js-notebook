import { app, dialog, ipcMain } from "electron";
import { readFile, writeFile } from "fs/promises";
import { ApplicationState, IPCEvents } from "./ipcTypes";
import { Store } from "./Store";

// evil global variable :(
export let isQuitting = false;

const stateStore = new Store<ApplicationState>("state");

export const registerIPCEvents = () => {
  ipcMain.handle(IPCEvents.ShowSaveDialog, () => {
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
  });

  ipcMain.handle(
    IPCEvents.SaveFile,
    async (_, filePath: string, fileContent: string) => {
      try {
        await writeFile(filePath, fileContent);
        return "";
      } catch (err) {
        return err.message as string;
      }
    }
  );

  ipcMain.handle(IPCEvents.LoadFileDialog, async () => {
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
  });

  ipcMain.handle(IPCEvents.LoadFile, async (_, filePath: string) => {
    try {
      const content = await readFile(filePath);
      return { error: "", content: content.toString() };
    } catch (err) {
      return {
        error: err.message as string,
        content: "",
      };
    }
  });

  ipcMain.handle(IPCEvents.Quit, async (_, state: ApplicationState) => {
    await stateStore.save(state);
    isQuitting = true;
    app.quit();
  });

  ipcMain.handle(IPCEvents.GetApplicationState, async () => {
    try {
      const state = await stateStore.open();
      return state;
    } catch (err) {
      return null;
    }
  });
};
