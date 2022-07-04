import { FileSettings } from "../../events/ipcTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  savedFile,
  SaveFileOptions,
  selectCells,
  selectFilePath,
  selectFileSettings,
  selectTitle,
  setFileError,
} from "../../redux/reducers/cells";
import { useNotification } from "../NotificationContext";

const saveFile = async ({
  content,
  ignoreCurrentFilePath,
  filePath,
}: SaveFileOptions) => {
  let cellFilePath = filePath;
  if (ignoreCurrentFilePath || !cellFilePath) {
    const { canceled, filePath } = await window.electron.getSaveFilePath();
    if (canceled) {
      throw new Error("cancelled");
    }
    cellFilePath =
      !filePath.endsWith(".jsnote") && !filePath.endsWith(".jsnote.json")
        ? filePath + ".jsnote"
        : filePath;
  }
  const error = await window.electron.saveFile(cellFilePath, content);
  if (error) {
    throw new Error(error);
  }
  return cellFilePath;
};

export interface StartSaveFileOptions {
  ignoreCurrentFilePath: boolean;
  // for immediate setting changes
  settings?: FileSettings;
}

export const useTrySaveFile = () => {
  const { createNotification } = useNotification();
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectTitle);
  const cells = useAppSelector(selectCells);
  const settings = useAppSelector(selectFileSettings);
  const filePath = useAppSelector(selectFilePath);

  const startSaveFile = async ({
    ignoreCurrentFilePath,
    settings: _settings,
  }: StartSaveFileOptions) => {
    const toBeSerialized = {
      title,
      cells,
      settings: _settings || settings,
    };
    try {
      const path = await saveFile({
        content: JSON.stringify(toBeSerialized, null, 2),
        ignoreCurrentFilePath,
        filePath,
      });
      dispatch(savedFile(path));
      createNotification("File Saved", "success");
    } catch (err) {
      dispatch(setFileError(err.message));
      if (err.message === "cancelled") {
        return;
      } else if (err.message.startsWith("ENOENT")) {
        createNotification("File cannot be saved...", "error");
      } else {
        createNotification(err.message, "error");
      }
    }
  };

  return { startSaveFile };
};
