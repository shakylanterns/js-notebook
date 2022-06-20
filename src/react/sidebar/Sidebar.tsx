import { useDisclosure, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaCog, FaHome } from "react-icons/fa";
import UnsavedFileModal from "../modals/UnsavedFileModal";
import Open from "./Open";
import Save from "./Save";
import SaveAs from "./SaveAs";
import SidebarIcon from "./SidebarIcon";
import { useTryOpenFile } from "./useTryOpenFile";

const Sidebar = () => {
  const disclosure = useDisclosure();
  const { startOpenFile } = useTryOpenFile();
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
        <Open />
        <Save />
        <SaveAs />
        <SidebarIcon icon={FaCog} text="Settings" />
      </VStack>
      <UnsavedFileModal {...disclosure} startOpenFile={startOpenFile} />
    </Fragment>
  );
};

export default Sidebar;
