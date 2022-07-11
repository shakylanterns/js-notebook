import "@testing-library/jest-dom";
import { EXAMPLE_STORAGE_PATH } from "./constants";

const appObject = {
  getPath() {
    return EXAMPLE_STORAGE_PATH;
  },
  quit: jest.fn(),
};

jest.mock("electron", () => {
  return {
    app: appObject,
  };
});

jest.mock("fs/promises", () => {
  return {
    writeFile: jest.fn(),
    readFile: jest.fn(),
    unlink: jest.fn(),
  };
});

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  const useNavigateHook = jest.fn();
  return {
    ...original,
    useNavigate: () => useNavigateHook,
  };
});

jest.mock("@chakra-ui/toast", () => {
  const original = jest.requireActual("@chakra-ui/toast");
  const useToastHook = jest.fn();
  return {
    ...original,
    useToast: () => useToastHook,
  };
});

// mock the entire context bridge
Object.defineProperty(window, "electron", {
  value: {
    quitProgram: jest.fn(),
    getSaveFilePath: jest.fn(),
    saveFile: jest.fn(),
    loadFilePath: jest.fn(),
    loadFile: jest.fn(),
    filePath: jest.fn(),
    listenToWindowClose: jest.fn(),
    reloadApplicationState: jest.fn(),
    deleteNote: jest.fn(),
    getSettings: jest.fn(),
    saveSettings: jest.fn(),
  },
});
