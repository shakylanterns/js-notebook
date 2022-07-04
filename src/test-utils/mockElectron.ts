import { vi } from "vitest";

export const EXAMPLE_STORAGE_PATH = "/home/testing/.config/js-notebook";

export const mockElectron = () => {
  vi.mock("electron", () => {
    return {
      app: {
        getPath() {
          return EXAMPLE_STORAGE_PATH;
        },
        quit: vi.fn(),
      },
    };
  });
};
