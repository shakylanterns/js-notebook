import { Box, Button } from "@chakra-ui/react";
import { useAppDispatch } from "../../redux/hooks";
import { addCell } from "../../redux/reducers/cells";

type Props = {
  lastIndex: number;
};

const AddCell = ({ lastIndex }: Props) => {
  const dispatch = useAppDispatch();

  function onAddSnippetBtnClick() {
    dispatch(
      addCell({
        index: lastIndex,
        type: "code",
      })
    );
  }

  function onAddTextBtnClick() {
    dispatch(
      addCell({
        index: lastIndex,
        type: "markdown",
      })
    );
  }

  return (
    <Box display={"flex"} justifyContent="center" gap={24}>
      <Button onClick={onAddSnippetBtnClick}>Add Snippet</Button>
      <Button onClick={onAddTextBtnClick}>Add Text</Button>
      <Box></Box>
    </Box>
  );
};

export default AddCell;
