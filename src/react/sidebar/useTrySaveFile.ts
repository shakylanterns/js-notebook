import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectFileError } from "../../redux/reducers/cells";
import { useSaveFile } from "../hooks/useSaveFile";
import { useNotification } from "../NotificationContext";

export const useTrySaveFile = () => {
  const fileError = useAppSelector(selectFileError);
  const [trySaving, setTrySaving] = useState(false);
  const { serializeAndSave } = useSaveFile();
  const { createNotification } = useNotification();

  useEffect(() => {
    if (fileError !== "cancelled" && trySaving) {
      createNotification("File Saved", "success");
    }
    setTrySaving(false);
  }, [trySaving, fileError]);

  const startSaveFile = async (ignoreCurrentFilePath: boolean) => {
    await serializeAndSave(ignoreCurrentFilePath);
    setTrySaving(true);
  };

  return { startSaveFile };
};
