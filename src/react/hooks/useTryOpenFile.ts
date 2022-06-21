import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { openFile, selectFileError } from "../../redux/reducers/cells";
import { useNotification } from "../NotificationContext";

export const useTryOpenFile = () => {
  const dispatch = useAppDispatch();
  const [tryOpening, setTryOpening] = useState(false);
  const fileError = useAppSelector(selectFileError);
  const { createNotification } = useNotification();

  useEffect(() => {
    if (!tryOpening) {
      return;
    }

    if (!fileError) {
      createNotification("File Opened", "success");
    } else {
      if (fileError !== "cancelled") {
        createNotification("This note file is malformed...", "error");
      }
    }

    setTryOpening(false);
  }, [tryOpening, fileError]);

  const startOpenFile = async () => {
    await dispatch(openFile({}));
    setTryOpening(true);
  };

  return { startOpenFile };
};
