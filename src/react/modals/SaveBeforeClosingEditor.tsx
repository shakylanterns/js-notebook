import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { closeEditor } from "../../redux/reducers/cells";
import { useTrySaveFile } from "../hooks/useTrySaveFile";

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
};

const SaveBeforeClosingEditor = ({ disclosure }: Props) => {
  const { onClose, isOpen } = disclosure;
  const dispatch = useAppDispatch();
  const { startSaveFile } = useTrySaveFile();
  const navigate = useNavigate();

  function onDoNotSaveBtnClick() {
    dispatch(closeEditor());
    navigate("/");
    onClose();
  }

  async function onSaveBtnClick() {
    await startSaveFile({ ignoreCurrentFilePath: false });
    onClose();
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unsaved Changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          File contains unsaved changes, do you want to save before leaving?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="primary" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" mr={3} onClick={onDoNotSaveBtnClick}>
            Do not Save
          </Button>
          <Button onClick={onSaveBtnClick}>Save First</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveBeforeClosingEditor;
