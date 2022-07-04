import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
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
import React, { ChangeEventHandler, useState } from "react";
import {
  FileSettings as FileSettingsModal,
  Languages,
} from "../../events/ipcTypes";
import { useAppSelector } from "../../redux/hooks";
import { selectFileSettings } from "../../redux/reducers/cells";

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
  setFileSettings: (settings: FileSettingsModal) => void;
};

const FileSettingsModal: React.FC<Props> = ({
  disclosure,
  setFileSettings,
}) => {
  const settings = useAppSelector(selectFileSettings) || {
    defaultLanguage: "javascript",
  };
  const [defaultLanguage, setDefaultLanguage] = useState<Languages>(
    settings.defaultLanguage
  );
  const { onClose, isOpen } = disclosure;

  const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDefaultLanguage(event.target.value as Languages);
  };

  function onSaveButtonClick() {
    setFileSettings({ defaultLanguage });
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>File Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
          <Button colorScheme="red" mr={3} onClick={onSaveButtonClick}>
            Save Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileSettingsModal;
