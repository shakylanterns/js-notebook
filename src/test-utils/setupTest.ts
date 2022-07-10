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
