import { unlink } from "fs/promises";
import { deleteFile } from "./deleteFile";
describe("delete file works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;

  it("returns true if file is deleted", async () => {
    // simulate correct deletion
    jest.mocked(unlink).mockResolvedValue(undefined);

    const result = await deleteFile(unusedObject, "exists.json");

    expect(unlink).toBeCalledWith("exists.json");
    expect(result).toBe(true);
  });

  it("returns false if file is deleted", async () => {
    // simulate correct deletion
    jest.mocked(unlink).mockRejectedValue(undefined);

    const result = await deleteFile(unusedObject, "exists.json");

    expect(result).toBe(false);
  });
});
