import { useToast, UseToastOptions } from "@chakra-ui/react";
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

export const saveFile = async ({
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
    cellFilePath = filePath;
  }
  cellFilePath =
    !cellFilePath.endsWith(".jsnote") && !cellFilePath.endsWith(".jsnote.json")
      ? cellFilePath + ".jsnote"
      : cellFilePath;
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

export const notificationObject: {
  saved: UseToastOptions;
  notExist: UseToastOptions;
  otherErrors: (err: Error) => UseToastOptions;
} = {
  saved: { title: "File Saved", status: "success" },
  notExist: {
    title: "Save Error",
    description: `File cannot be saved!`,
    status: "error",
  },
  otherErrors: (err: Error) => ({
    title: "Save Error",
    description: err.message,
    status: "error",
  }),
};

export const useTrySaveFile = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectTitle);
  const cells = useAppSelector(selectCells);
  const settings = useAppSelector(selectFileSettings);
  const filePath = useAppSelector(selectFilePath);
  const toast = useToast();

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
      toast(notificationObject.saved);
    } catch (err) {
      dispatch(setFileError(err.message));
      if (err.message === "cancelled") {
        return;
      } else if (err.message.startsWith("ENOENT")) {
        toast(notificationObject.notExist);
      } else {
        toast(notificationObject.otherErrors(err));
      }
    }
  };

  return { startSaveFile };
};
