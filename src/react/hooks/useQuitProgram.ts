import { useAppSelector } from "../../redux/hooks";
import { selectFilePath, selectRecentFiles } from "../../redux/reducers/cells";

export const useQuitProgram = () => {
  const filePath = useAppSelector(selectFilePath);
  const recentFiles = useAppSelector(selectRecentFiles);
  const quitProgram = () => {
    window.electron.quitProgram({
      openedFilePath: filePath,
      scrollPosition: window.scrollY,
      // this will only select the first ten items
      recentFiles: recentFiles.slice(0, 11),
    });
  };

  return { quitProgram };
};
