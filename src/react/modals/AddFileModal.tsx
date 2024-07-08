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
import { Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { FileSettings } from "../../events/ipcTypes";
import { useAppSelector } from "../../redux/hooks";
import { selectAppSettings } from "../../redux/reducers/app";

type Props = {
  disclosure: ReturnType<typeof useDisclosure>;
  createNewNote: (fileSettings: FileSettings, title: string) => void;
};

const AddFileModal: React.FC<Props> = ({ disclosure, createNewNote }) => {
  const settings = useAppSelector(selectAppSettings);
  console.log(settings);
  const { onClose, isOpen } = disclosure;
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings.defaultLanguage
  );

  // settings is updated, but defaultLanguage is not updated
  // for some reason
  useEffect(() => {
    setDefaultLanguage(settings.defaultLanguage);
  }, [settings]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Note</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ title: "", language: defaultLanguage }}
          onSubmit={(val) => {
            console.log(val);
            createNewNote({ defaultLanguage: val.language }, val.title);
          }}
        >
          {(formik) => {
            return (
              <Fragment>
                <ModalBody>
                  <FormControl marginBottom={4}>
                    <FormLabel>Title</FormLabel>
                    <Input {...formik.getFieldProps("title")} />
                  </FormControl>
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
                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={formik.submitForm}
                  >
                    Confirm
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

export default AddFileModal;
