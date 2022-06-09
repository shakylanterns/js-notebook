import { Box, Button } from "@chakra-ui/react";
import { FaCode, FaMarkdown } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { addCell } from "../../redux/reducers/cells";

type Props = {
  lastIndex: number;
  index: number;
};

const AddCell = ({ lastIndex, index }: Props) => {
  const dispatch = useAppDispatch();

  function onAddSnippetBtnClick() {
    dispatch(
      addCell({
        index: index,
        type: "code",
      })
    );
  }

  function onAddTextBtnClick() {
    dispatch(
      addCell({
        index: index,
        type: "markdown",
      })
    );
  }

  return (
    <Box
      display={"flex"}
      opacity={lastIndex === index ? 1 : 0}
      justifyContent="center"
      gap={24}
      position="relative"
      _hover={{ opacity: 1 }}
      transitionDelay={"0s"}
      transitionDuration={"0.2s"}
      transitionProperty="opacity"
      transitionTimingFunction={"ease-in"}
    >
      <Button onClick={onAddSnippetBtnClick} leftIcon={<FaCode />}>
        Add Snippet
      </Button>
      <Button onClick={onAddTextBtnClick} leftIcon={<FaMarkdown />}>
        Add Text
      </Button>
      <Box
        position="absolute"
        borderBottomWidth={0.5}
        borderBottomColor="gray.200"
        top="50%"
        width="100%"
        zIndex={-100}
      ></Box>
    </Box>
  );
};

export default AddCell;
