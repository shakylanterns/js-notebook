import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { FileSettings } from "../../events/ipcTypes";
import { useAppDispatch } from "../../redux/hooks";
import {
  setFileSettings,
  setTitle,
  startEditor,
} from "../../redux/reducers/cells";
import AddFileModal from "../modals/AddFileModal";

const CreateNewNote = () => {
  const dispatch = useAppDispatch();
  const disclosure = useDisclosure();

  const onNewNoteBtnClick = () => {
    disclosure.onOpen();
  };

  function createNewNote(fileSettings: FileSettings, title: string) {
    dispatch(setFileSettings(fileSettings));
    dispatch(setTitle(title));
    dispatch(startEditor());
    disclosure.onClose();
  }

  return (
    <Box>
      <AddFileModal disclosure={disclosure} createNewNote={createNewNote} />
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
