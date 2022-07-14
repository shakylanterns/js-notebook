import { Button, useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaTrash } from "react-icons/fa";
import { useTryDeleteNote } from "../hooks/useTryDeleteNote";
import DeleteConfirm from "../modals/DeleteConfirm";

const DeleteNote = () => {
  const disclosure = useDisclosure();
  const { tryDeleteNote } = useTryDeleteNote();

  function onDeleteBtnClick() {
    disclosure.onOpen();
  }

  return (
    <Fragment>
      <Button
        onClick={onDeleteBtnClick}
        leftIcon={<FaTrash />}
        colorScheme="red"
      >
        Delete
      </Button>
      <DeleteConfirm disclosure={disclosure} deleteNote={tryDeleteNote} />
    </Fragment>
  );
};

export default DeleteNote;
