import { render } from "./react";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { ApplicationState } from "./ipcTypes";

declare global {
  interface Window {
    electron: {
      getSaveFilePath: () => Promise<Electron.SaveDialogReturnValue>;
      saveFile: (filePath: string, fileContent: string) => Promise<string>;
      loadFilePath: () => Promise<Electron.OpenDialogReturnValue>;
      loadFile: (
        filePath: string
      ) => Promise<{ content: string; error: string }>;
      listenToWindowClose: (callback: () => void) => void;
      quitProgram: (state: ApplicationState) => void;
      reloadApplicationState: () => Promise<ApplicationState | null>;
    };
  }
}

loader.config({ monaco });

render();
