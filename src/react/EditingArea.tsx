import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../redux/hooks";
import { selectHasEditorOpened } from "../redux/reducers/cells";
import Editor from "./editor/Editor";
import HomeScreen from "./home/HomeScreen";

const EditingArea = () => {
  const hasEditorOpened = useAppSelector(selectHasEditorOpened);

  return (
    <Box
      flexGrow={1}
      paddingX={8}
      paddingTop={12}
      maxWidth="90vw"
      minHeight="100vh"
    >
      {hasEditorOpened ? <Editor /> : <HomeScreen />}
    </Box>
  );
};

export default EditingArea;
