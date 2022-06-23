import { Box, Button } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { startEditor } from "../../redux/reducers/cells";

const CreateNewNote = () => {
  const dispatch = useAppDispatch();

  const onNewNoteBtnClick = () => {
    dispatch(startEditor());
  };
  return (
    <Box>
      <Button
        colorScheme="primary"
        leftIcon={<FaPlus />}
        size="md"
        onClick={onNewNoteBtnClick}
      >
        Create New Note
      </Button>
    </Box>
  );
};

export default CreateNewNote;
