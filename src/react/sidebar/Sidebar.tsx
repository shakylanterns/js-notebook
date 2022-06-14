import { VStack } from "@chakra-ui/react";
import { FaCog, FaFile, FaHome, FaRegSave, FaSave } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  openFile,
  saveFile,
  selectCells,
  selectTitle,
} from "../../redux/reducers/cells";
import SidebarIcon from "./SidebarIcon";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const cells = useAppSelector(selectCells);
  const title = useAppSelector(selectTitle);

  const onSaveBtnClick = () => {
    const toBeSerialized = {
      title,
      cells,
    };
    dispatch(saveFile(JSON.stringify(toBeSerialized, null, 2)));
  };

  const onOpenBtnClick = () => {
    dispatch(openFile());
  };

  return (
    <VStack
      borderRightWidth={0.5}
      borderRightColor="gray.400"
      paddingTop={12}
      spacing={8}
      height="100vh"
      overflowY="hidden"
      minWidth="85px"
      maxWidth="10vw"
    >
      <SidebarIcon icon={FaHome} text="Home" />
      <SidebarIcon icon={FaFile} text="Oepn Note" onClick={onOpenBtnClick} />
      <SidebarIcon icon={FaSave} text="Save" onClick={onSaveBtnClick} />
      <SidebarIcon icon={FaRegSave} text="Save As" />
      <SidebarIcon icon={FaCog} text="Settings" />
    </VStack>
  );
};

export default Sidebar;
