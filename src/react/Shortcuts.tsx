import { Fragment } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useAppSelector } from "../redux/hooks";
import { selectHasEditorOpened } from "../redux/reducers/cells";
import { useTrySaveFile } from "./hooks/useTrySaveFile";

const Shortcuts = () => {
  const { startSaveFile } = useTrySaveFile();
  const opened = useAppSelector(selectHasEditorOpened);

  useHotkeys(
    "ctrl+s",
    function () {
      if (opened) {
        startSaveFile({ ignoreCurrentFilePath: false });
      }
    },
    // useHotKeys cannot reach the "opened" value in the outer scope
    [opened]
  );

  return <Fragment></Fragment>;
};

export default Shortcuts;
