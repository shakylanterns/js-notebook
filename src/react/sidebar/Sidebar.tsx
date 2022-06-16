import { useDisclosure, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaCog, FaFile, FaHome, FaRegSave, FaSave } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  openFile, selectIsFileTouched
} from "../../redux/reducers/cells";
import { useSaveFile } from "../hooks/useSaveFile";
import UnsavedFileModal from "../modals/UnsavedFileModal";
import SidebarIcon from "./SidebarIcon";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const disclosure = useDisclosure();
  const touched = useAppSelector(selectIsFileTouched);
  const { serializeAndSave } = useSaveFile();

  const onSaveBtnClick = () => {
    serializeAndSave(false);
  };

  const onSaveAsBtnClick = () => {
    serializeAndSave(true);
  };

  const onOpenBtnClick = () => {
    if (touched) {
      // open the modal
      // only the modal will call startOpenFile
      disclosure.onOpen();
    } else {
      // if the file is not touched
      startOpenFile();
    }
  };

  const startOpenFile = () => {
    dispatch(openFile());
  };

  return (
    <Fragment>
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
        <SidebarIcon icon={FaFile} text="Open Note" onClick={onOpenBtnClick} />
        <SidebarIcon icon={FaSave} text="Save" onClick={onSaveBtnClick} />
        <SidebarIcon
          icon={FaRegSave}
          text="Save As"
          onClick={onSaveAsBtnClick}
        />
        <SidebarIcon icon={FaCog} text="Settings" />
      </VStack>
      <UnsavedFileModal {...disclosure} startOpenFile={startOpenFile} />
    </Fragment>
  );
};

export default Sidebar;
