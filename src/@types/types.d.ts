export {};

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
      deleteNote: (filePath: string) => Promise<boolean>;
      getSettings: () => Promise<ApplicationSettings>;
      saveSettings: (settings: ApplicationSettings) => Promise<boolean>;
    };
  }
}
