import { writeFile } from "fs/promises";
import { IPCEventHandler } from "./ipcTypes";

export const saveFile: IPCEventHandler = async (
  _,
  filePath: string,
  fileContent: string
) => {
  try {
    await writeFile(filePath, fileContent);
    return "";
  } catch (err) {
    return err.message as string;
  }
};
