import { app, dialog, ipcMain } from "electron";
import { readFile, unlink, writeFile } from "fs/promises";
import { ApplicationSettings, ApplicationState, IPCEvents } from "./ipcTypes";
import { Store } from "./lib/Store";

// evil global variable :(
export let isQuitting = false;

const stateStore = new Store<ApplicationState>("state");
const settingsStore = new Store<ApplicationSettings>("settings");

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

  ipcMain.handle(IPCEvents.DeleteFile, async (_, filePath: string) => {
    try {
      await unlink(filePath);
      return true;
    } catch (_1) {
      return false;
    }
  });

  ipcMain.handle(IPCEvents.GetSettings, async () => {
    try {
      const state = await settingsStore.open();
      return state;
    } catch (err) {
      return null;
    }
  });

  ipcMain.handle(
    IPCEvents.SaveSettings,
    async (_, settings: ApplicationSettings) => {
      try {
        await settingsStore.save(settings);
        return true;
      } catch (_1) {
        return false;
      }
    }
  );
};
