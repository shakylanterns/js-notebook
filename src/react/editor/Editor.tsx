import { Box, Flex } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import { selectCells } from "../../redux/reducers/cells";
import Cell from "../cell/Cell";
import AddCell from "./AddCell";
import DocumentTitle from "./DocumentTitle";
import FileControls from "./FileControls";

const Editor = () => {
  const cells = useAppSelector(selectCells);

  const editorElements = cells.length ? (
    <Flex gap={4} flexDir="column">
      {cells.map((cell, index) => (
        <Flex gap={2} flexDir="column" key={`cell-${index}`}>
          <Cell cell={cell} index={index} />
          <AddCell lastIndex={cells.length} index={index + 1} />
        </Flex>
      ))}
    </Flex>
  ) : (
    <AddCell lastIndex={cells.length} index={cells.length} />
  );

  return (
    <Box position="relative">
      <FileControls />
      <DocumentTitle />
      {editorElements}
    </Box>
  );
};

export default Editor;
