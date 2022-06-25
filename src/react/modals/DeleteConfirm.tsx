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

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
  deleteNote: () => void;
};

const DeleteConfirm: React.FC<Props> = ({ disclosure, deleteNote }) => {
  const { onClose, isOpen } = disclosure;
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure this file should be deleted?</ModalBody>
        <ModalFooter>
          <Button colorScheme="primary" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" mr={3} onClick={deleteNote}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirm;
