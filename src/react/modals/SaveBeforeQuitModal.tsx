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
import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { selectIsFileTouched } from "../../redux/reducers/cells";
import { useSaveFile } from "../hooks/useSaveFile";

const SaveBeforeQuitModal = () => {
  const touched = useAppSelector(selectIsFileTouched);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { serializeAndSave } = useSaveFile();

  function onQuitBtnClick() {
    window.electron.quitProgram();
  }

  async function onSaveBtnClick() {
    await serializeAndSave(false);
    window.electron.quitProgram();
  }

  useEffect(() => {
    window.electron.listenToWindowClose(() => {
      if (!touched) {
        window.electron.quitProgram();
      } else {
        onOpen();
      }
    });
  }, [touched]);

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
          <Button colorScheme="red" mr={3} onClick={onQuitBtnClick}>
            Quit Anyway
          </Button>
          <Button onClick={onSaveBtnClick}>Save File</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveBeforeQuitModal;
