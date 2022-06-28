import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { ChangeEventHandler, useState } from "react";
import { FileSettings, Languages } from "../../ipcTypes";
import { useAppSelector } from "../../redux/hooks";
import { selectAppSettings } from "../../redux/reducers/app";

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
  createNewNote: (fileSettings: FileSettings, title: string) => void;
};

const AddFileModal: React.FC<Props> = ({ disclosure, createNewNote }) => {
  const settings = useAppSelector(selectAppSettings);
  const { onClose, isOpen } = disclosure;
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings.defaultLanguage
  );
  const [title, setTitle] = useState("");

  function onConfirmBtnClick() {
    createNewNote(
      {
        defaultLanguage,
      },
      title
    );
  }

  const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDefaultLanguage(event.target.value as Languages);
  };

  const onTitleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTitle(event.target.value);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl marginBottom={4}>
            <FormLabel>Title</FormLabel>
            <Input onChange={onTitleChange} value={title} />
          </FormControl>
          <FormControl>
            <FormLabel>Language</FormLabel>
            <Select value={defaultLanguage} onChange={onLanguageChange}>
              <option value="javascript">Javascript</option>
              <option value="typescript">Typescript</option>
            </Select>
            <FormHelperText>
              This determines the language of the snippets
            </FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="primary" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" mr={3} onClick={onConfirmBtnClick}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFileModal;
