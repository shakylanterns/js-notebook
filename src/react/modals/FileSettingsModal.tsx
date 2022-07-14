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
import { Formik } from "formik";
import React, { Fragment } from "react";
import { FileSettings as FileSettingsModal } from "../../events/ipcTypes";
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
  const { onClose, isOpen } = disclosure;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>File Settings</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ language: settings.defaultLanguage }}
          onSubmit={(values) =>
            setFileSettings({ defaultLanguage: values.language })
          }
        >
          {(formik) => {
            return (
              <Fragment>
                <ModalBody>
                  <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select {...formik.getFieldProps("language")}>
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
                  <Button colorScheme="red" mr={3} onClick={formik.submitForm}>
                    Save Settings
                  </Button>
                </ModalFooter>
              </Fragment>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default FileSettingsModal;
