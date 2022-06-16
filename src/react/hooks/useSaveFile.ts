import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { saveFile, selectCells, selectTitle } from "../../redux/reducers/cells";

export const useSaveFile = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector(selectTitle);
  const cells = useAppSelector(selectCells);
  const serializeAndSave = async (ignoreCurrentFilePath: boolean) => {
    const toBeSerialized = {
      title,
      cells,
    };
    return await dispatch(
      saveFile({
        content: JSON.stringify(toBeSerialized, null, 2),
        ignoreCurrentFilePath,
      })
    );
  };
  return { serializeAndSave };
};
