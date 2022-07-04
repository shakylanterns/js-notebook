import { writeFile } from "fs/promises";
import { describe, expect, it, vi } from "vitest";
import { saveFile } from "./saveFile";

describe("save file works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;

  it("returns empty string if file is written", async () => {
    // simulate correct read file
    const content = "{}";
    const filename = "dummy";
    const result = await saveFile(unusedObject, filename, content);

    expect(writeFile).toBeCalledWith(filename, content);
    expect(result).toBe("");
  });

  it("returns empty content and non empty error message when file not found", async () => {
    // simulate file not found
    vi.mocked(writeFile).mockRejectedValue(new Error("error"));
    const result = await saveFile(unusedObject, "dummy", "");
    expect(result).toBeTypeOf("string");
    expect(result).not.toBe("");
  });
});
