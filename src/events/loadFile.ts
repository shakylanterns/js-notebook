import { readFile } from "fs/promises";
import { IPCEventHandler } from "./ipcTypes";

export const loadFile: IPCEventHandler = async (_, filePath: string) => {
  try {
    const content = await readFile(filePath);
    return { error: "", content: content.toString() };
  } catch (err) {
    return {
      error: err.message as string,
      content: "",
    };
  }
};
