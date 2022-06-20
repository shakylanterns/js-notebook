import { FaSave } from "react-icons/fa";
import SidebarIcon from "./SidebarIcon";
import { useTrySaveFile } from "./useTrySaveFile";

const Save = () => {
  const { startSaveFile } = useTrySaveFile();

  const onSaveBtnClick = () => {
    startSaveFile(false);
  };

  return <SidebarIcon icon={FaSave} text="Save" onClick={onSaveBtnClick} />;
};

export default Save;
