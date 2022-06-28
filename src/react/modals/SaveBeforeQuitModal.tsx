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
import { useQuitProgram } from "../hooks/useQuitProgram";
import { useTrySaveFile } from "../hooks/useTrySaveFile";

const SaveBeforeQuitModal = () => {
  const touched = useAppSelector(selectIsFileTouched);
  const { startSaveFile } = useTrySaveFile();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { quitProgram } = useQuitProgram();

  function onQuitBtnClick() {
    quitProgram();
  }

  async function onSaveBtnClick() {
    await startSaveFile({ ignoreCurrentFilePath: false });
    setTimeout(() => {
      quitProgram();
    }, 1000);
  }

  useEffect(() => {
    window.electron.listenToWindowClose(() => {
      touched ? onOpen() : quitProgram();
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
