import { Fragment, useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setRecentFiles } from "../redux/reducers/cells";
import { useTryOpenFile } from "./hooks/useTryOpenFile";

const SavedStateInitializer = () => {
  const dispatch = useAppDispatch();
  const { startOpenFile } = useTryOpenFile();

  useEffect(() => {
    const loadState = async () => {
      const state = await window.electron.reloadApplicationState();
      if (!state) {
        return;
      }
      if (state.openedFilePath) {
        startOpenFile({ filePath: state.openedFilePath });
      }
      if (state.scrollPosition) {
        window.scrollTo(0, state.scrollPosition);
      }
      if (state.recentFiles) {
        dispatch(setRecentFiles(state.recentFiles));
      }
    };

    loadState();
  }, []);

  return <Fragment></Fragment>;
};

export default SavedStateInitializer;
