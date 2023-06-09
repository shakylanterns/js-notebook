import { useDisclosure, VStack } from "@chakra-ui/react";
import { Fragment } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectHasEditorOpened } from "../../redux/reducers/cells";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import UnsavedFileModal from "../modals/UnsavedFileModal";
import Home from "./Home";
import Open from "./Open";
import Save from "./Save";
import SaveAs from "./SaveAs";
import Settings from "./Settings";

const Sidebar = () => {
  const isEditing = useAppSelector(selectHasEditorOpened);
  const disclosure = useDisclosure();
  const { startOpenFile } = useTryOpenFile();
  return (
    <Fragment>
      <VStack
        position={"fixed"}
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
        <Open />
        {isEditing && (
          <Fragment>
            <Save />
            <SaveAs />
          </Fragment>
        )}
        <Settings />
      </VStack>
      <UnsavedFileModal disclosure={disclosure} startOpenFile={startOpenFile} />
    </Fragment>
  );
};

export default Sidebar;
