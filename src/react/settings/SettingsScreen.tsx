import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Select,
  useToast,
  UseToastOptions
} from "@chakra-ui/react";
import { Formik } from "formik";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Languages } from "../../events/ipcTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAppSettings, setSettings } from "../../redux/reducers/app";
import { selectHasEditorOpened } from "../../redux/reducers/cells";

export const notificationObjects: Record<"saved" | "failed", UseToastOptions> = {
  saved: { title: "Settings Saved", status: "success" },
  failed: { title: "Settings cannot be saved...", status: "error" },
};

const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectAppSettings);
  const isEditing = useAppSelector(selectHasEditorOpened);
  const navigate = useNavigate();
  const toast = useToast();

  async function saveSettings(defaultLanguage: Languages) {
    dispatch(setSettings({ defaultLanguage }));
    const success = await window.electron.saveSettings({ defaultLanguage });
    if (success) {
      toast(notificationObjects.saved);
    } else {
      toast(notificationObjects.failed);
    }
  }
  return (
    <Fragment>
      <Heading marginBottom={12} fontSize="3xl" as="h1">
        Settings
      </Heading>
      <Formik
        initialValues={{ language: settings.defaultLanguage }}
        onSubmit={({ language }) => saveSettings(language)}
      >
        {(formik) => {
          return (
            <Fragment>
              <FormControl marginBottom={4}>
                <FormLabel>Language</FormLabel>
                <Select {...formik.getFieldProps("language")}>
                  <option value="javascript">Javascript</option>
                  <option value="typescript">Typescript</option>
                </Select>
                <FormHelperText>
                  This will be the default language when a new note is created.
                  It would not affect any existing files. The language of
                  individual files can be changed in file settings.
                </FormHelperText>
              </FormControl>
              <ButtonGroup marginTop={12} spacing={4}>
                <Button onClick={formik.submitForm} colorScheme="primary">
                  Save Settings
                </Button>
                {isEditing && (
                  <Button onClick={() => navigate("/editor")}>
                    Go Back to Editor
                  </Button>
                )}
              </ButtonGroup>
            </Fragment>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default SettingsScreen;
