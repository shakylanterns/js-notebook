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

interface Props {
  disclosure: ReturnType<typeof useDisclosure>;
  startOpenFile: () => void;
}

const UnsavedFileModal: React.FC<Props> = ({ disclosure, startOpenFile }) => {
  const { isOpen, onClose } = disclosure;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unsaved Changes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          All unsaved changes will be discarded when a new note file is opened.
          Continue?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="primary" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              startOpenFile();
            }}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UnsavedFileModal;
