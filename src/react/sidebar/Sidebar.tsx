import { VStack } from "@chakra-ui/react";
import { FaCog, FaHome, FaRegSave, FaSave } from "react-icons/fa";
import SidebarIcon from "./SidebarIcon";

const Sidebar = () => {
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
      <SidebarIcon icon={FaSave} text="Save" />
      <SidebarIcon icon={FaRegSave} text="Save As" />
      <SidebarIcon icon={FaCog} text="Settings" />
    </VStack>
  );
};

export default Sidebar;
