import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import { selectCells } from "../../redux/reducers/cells";
import Cell from "../cell/Cell";
import AddCell from "./AddCell";

const Editor = () => {
  const cells = useAppSelector(selectCells);

  return (
    <Box
      flexGrow={1}
      paddingX={8}
      paddingTop={12}
      maxWidth="90vw"
      minHeight="100vh"
    >
      {cells.map((cell, index) => (
        <Cell cell={cell} key={`cell-${index}`} index={index} />
      ))}
      <AddCell lastIndex={cells.length} />
    </Box>
  );
};

export default Editor;
