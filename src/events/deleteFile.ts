import { unlink } from "fs/promises";
import { IPCEventHandler } from "./ipcTypes";

export const deleteFile: IPCEventHandler = async (_, filePath: string) => {
  try {
    await unlink(filePath);
    return true;
  } catch (_1) {
    return false;
  }
};
