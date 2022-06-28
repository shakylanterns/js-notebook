import { useDisclosure, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaCog } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { selectHasEditorOpened } from "../../redux/reducers/cells";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import UnsavedFileModal from "../modals/UnsavedFileModal";
import Home from "./Home";
import Open from "./Open";
import Save from "./Save";
import SaveAs from "./SaveAs";
import SidebarIcon from "./SidebarIcon";

interface Props {
  goToSettingsPage: () => void;
  goToHomePage: () => void;
}

const Sidebar: React.FC<Props> = ({ goToSettingsPage, goToHomePage }) => {
  const disclosure = useDisclosure();
  const { startOpenFile } = useTryOpenFile();
  const isEditing = useAppSelector(selectHasEditorOpened);
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
        <Home goToHomePage={goToHomePage} />
        <Open disclosure={disclosure} />
        {isEditing && (
          <Fragment>
            <Save />
            <SaveAs />
          </Fragment>
        )}
        <SidebarIcon icon={FaCog} text="Settings" onClick={goToSettingsPage} />
      </VStack>
      <UnsavedFileModal disclosure={disclosure} startOpenFile={startOpenFile} />
    </Fragment>
  );
};

export default Sidebar;
