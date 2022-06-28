import { FaRegSave } from "react-icons/fa";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import SidebarIcon from "./SidebarIcon";

const SaveAs = () => {
  const { startSaveFile } = useTrySaveFile();

  const onSaveAsBtnClick = () => {
    startSaveFile({
      ignoreCurrentFilePath: true,
    });
  };

  return (
    <SidebarIcon icon={FaRegSave} text="Save As" onClick={onSaveAsBtnClick} />
  );
};

export default SaveAs;
