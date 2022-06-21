import { useDisclosure } from "@chakra-ui/react";
import { FaFile } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { selectIsFileTouched } from "../../redux/reducers/cells";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import SidebarIcon from "./SidebarIcon";

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
};

const Open = ({ disclosure }: Props) => {
  console.log(disclosure);
  const { onOpen } = disclosure;
  const touched = useAppSelector(selectIsFileTouched);
  const { startOpenFile } = useTryOpenFile();

  const onOpenBtnClick = () => {
    if (touched) {
      // open the modal
      // only the modal will call startOpenFile
      onOpen();
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
