import { useDisclosure } from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { selectIsFileTouched } from "../../redux/reducers/cells";
import SidebarIcon from "./SidebarIcon";
import { useTryOpenFile } from "./useTryOpenFile";

const Open = () => {
  const disclosure = useDisclosure();
  const touched = useAppSelector(selectIsFileTouched);
  const { startOpenFile } = useTryOpenFile();

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

  return (
    <SidebarIcon icon={FaFile} text="Open Note" onClick={onOpenBtnClick} />
  );
};

export default Open;
