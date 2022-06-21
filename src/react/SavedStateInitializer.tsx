import { Fragment, useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { openFile } from "../redux/reducers/cells";

const SavedStateInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadState = async () => {
      const state = await window.electron.reloadApplicationState();
      if (!state) {
        return;
      }
      if (state.openedFilePath) {
        dispatch(openFile({ filePath: state.openedFilePath }));
      }
      if (state.scrollPosition) {
        window.scrollTo(0, state.scrollPosition);
      }
    };

    loadState();
  }, []);

  return <Fragment></Fragment>;
};

export default SavedStateInitializer;
