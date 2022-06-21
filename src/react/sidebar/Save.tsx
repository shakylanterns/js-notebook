import { FaSave } from "react-icons/fa";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import SidebarIcon from "./SidebarIcon";

const Save = () => {
  const { startSaveFile } = useTrySaveFile();

  const onSaveBtnClick = () => {
    startSaveFile(false);
  };

  return <SidebarIcon icon={FaSave} text="Save" onClick={onSaveBtnClick} />;
};

export default Save;
