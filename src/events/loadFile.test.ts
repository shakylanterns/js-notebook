import { readFile } from "fs/promises";
import { describe, expect, it, vi } from "vitest";
import { loadFile } from "./loadFile";

describe("load file works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;

  it("returns the correct if file exists", async () => {
    // simulate correct read file
    const content = "{}";
    const filename = "dummy";
    vi.mocked(readFile).mockResolvedValue(content);
    const result = await loadFile(unusedObject, filename);

    expect(readFile).toBeCalledWith(filename);
    expect(result).toEqual({
      content: content,
      error: "",
    });
  });

  it("returns empty content and non empty error message when file not found", async () => {
    // simulate file not found
    vi.mocked(readFile).mockRejectedValue(new Error("error"));
    const result = await loadFile(unusedObject, "dummy");
    expect(result.content).toBe("");
    expect(result.error).toBeTruthy();
  });
});
