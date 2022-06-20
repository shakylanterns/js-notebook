import { FaRegSave } from "react-icons/fa";
import SidebarIcon from "./SidebarIcon";
import { useTrySaveFile } from "./useTrySaveFile";

const SaveAs = () => {
  const { startSaveFile } = useTrySaveFile();

  const onSaveAsBtnClick = () => {
    startSaveFile(true);
  };

  return (
    <SidebarIcon icon={FaRegSave} text="Save As" onClick={onSaveAsBtnClick} />
  );
};

export default SaveAs;
