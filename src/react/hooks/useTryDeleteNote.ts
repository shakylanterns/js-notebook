import { useDisclosure, useToast, UseToastOptions } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteNote, selectFilePath } from "../../redux/reducers/cells";

export const notificationObjects: {
  notSaved: UseToastOptions;
  repeated: (filePath: string) => UseToastOptions;
  success: UseToastOptions;
} = {
  notSaved: {
    title: "Deletion Failed",
    description: "This file is not saved yet, thus cannot be deleted...",
    status: "error",
  },
  repeated: (filePath: string) => ({
    title: "Deletion Failed",
    description: `Could not delete ${filePath}. Perhaps it is deleted already?`,
    status: "error",
  }),
  success: { title: "File Deleted", status: "info" },
};

export const useTryDeleteNote = () => {
  const dispatch = useAppDispatch();
  const filePath = useAppSelector(selectFilePath);
  const navigate = useNavigate();
  const toast = useToast();

  async function tryDeleteNote(disclosure?: ReturnType<typeof useDisclosure>) {
    if (!filePath) {
      toast(notificationObjects.notSaved);
    } else {
      const success = await window.electron.deleteNote(filePath);
      if (success) {
        dispatch(deleteNote(filePath));
        toast(notificationObjects.success);
        navigate("/");
      } else {
        toast(notificationObjects.repeated(filePath));
      }
    }

    // close modal if needed
    if (disclosure) {
      disclosure.onClose();
    }
  }

  return { tryDeleteNote };
};
