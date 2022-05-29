import { Box } from "@chakra-ui/react";
import Cell from "./Cell";

const Editor = () => {
  return (
    <Box flexGrow={1} paddingX={8} paddingTop={12}>
      <Cell type="code" />
    </Box>
  );
};

export default Editor;
