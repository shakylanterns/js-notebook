import { unlink } from "fs/promises";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { mockFs } from "../test-utils/mockFs";
import { deleteFile } from "./deleteFile";

describe("delete file works", () => {
  beforeAll(() => {
    mockFs();
  });

  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;

  it("returns true if file is deleted", async () => {
    // simulate correct deletion
    vi.mocked(unlink).mockResolvedValue(undefined);

    const result = await deleteFile(unusedObject, "exists.json");

    expect(unlink).toBeCalledWith("exists.json");
    expect(result).toBe(true);
  });

  it("returns false if file is deleted", async () => {
    // simulate correct deletion
    vi.mocked(unlink).mockRejectedValue(undefined);

    const result = await deleteFile(unusedObject, "exists.json");

    expect(result).toBe(false);
  });
});
