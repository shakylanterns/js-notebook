import { useDisclosure, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaCog } from "react-icons/fa";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import UnsavedFileModal from "../modals/UnsavedFileModal";
import Home from "./Home";
import Open from "./Open";
import Save from "./Save";
import SaveAs from "./SaveAs";
import SidebarIcon from "./SidebarIcon";

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
        <Home />
        <Open disclosure={disclosure} />
        <Save />
        <SaveAs />
        <SidebarIcon icon={FaCog} text="Settings" />
      </VStack>
      <UnsavedFileModal disclosure={disclosure} startOpenFile={startOpenFile} />
    </Fragment>
  );
};

export default Sidebar;
