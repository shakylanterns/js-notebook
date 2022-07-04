import { vi } from "vitest";

export const mockFs = () => {
  vi.mock("fs/promises", () => {
    return {
      writeFile: vi.fn(),
      readFile: vi.fn(),
      unlink: vi.fn(),
    };
  });
};
