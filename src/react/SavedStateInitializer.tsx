import objectMerge from "object-merge";
import { Fragment, useEffect } from "react";
import { ApplicationSettings } from "../events/ipcTypes";
import { useAppDispatch } from "../redux/hooks";
import { setSettings } from "../redux/reducers/app";
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

  useEffect(() => {
    const loadSettings = async () => {
      const state = await window.electron.getSettings();
      const merged = objectMerge(
        {
          defaultLanguage: "javascript",
        },
        state
      );
      dispatch(setSettings(merged as ApplicationSettings));
    };

    loadSettings();
  }, []);

  return <Fragment></Fragment>;
};

export default SavedStateInitializer;
