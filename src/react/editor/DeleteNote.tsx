import { Button, useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteNote, selectFilePath } from "../../redux/reducers/cells";
import DeleteConfirm from "../modals/DeleteConfirm";
import { useNotification } from "../NotificationContext";

const DeleteNote = () => {
  const disclosure = useDisclosure();
  const dispatch = useAppDispatch();
  const filePath = useAppSelector(selectFilePath);
  const navigate = useNavigate();
  const { createNotification } = useNotification();

  function onDeleteBtnClick() {
    disclosure.onOpen();
  }

  async function tryDeleteNote() {
    if (!filePath) {
      createNotification(
        "This file is not saved yet, thus cannot be deleted...",
        "error"
      );
    } else {
      const success = await window.electron.deleteNote(filePath);
      if (success) {
        dispatch(deleteNote(filePath));
        createNotification("Deleted.", "success");
        navigate("/");
      } else {
        createNotification(
          `Could not delete ${filePath}. Perhaps it is deleted already?`,
          "error"
        );
      }
    }
    disclosure.onClose();
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
