import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Select,
  useToast,
} from "@chakra-ui/react";
import { ChangeEventHandler, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Languages } from "../../events/ipcTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAppSettings, setSettings } from "../../redux/reducers/app";
import { selectHasEditorOpened } from "../../redux/reducers/cells";

const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectAppSettings);
  const isEditing = useAppSelector(selectHasEditorOpened);
  const navigate = useNavigate();
  const toast = useToast();
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings.defaultLanguage
  );

  const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDefaultLanguage(event.target.value as Languages);
  };

  async function saveSettings() {
    dispatch(setSettings({ defaultLanguage }));
    const success = await window.electron.saveSettings({ defaultLanguage });
    if (success) {
      toast({ title: "Settings Saved", status: "success" });
    } else {
      toast({ title: "Settings cannot be saved...", status: "error" });
    }
  }
  return (
    <Fragment>
      <Heading marginBottom={12} fontSize="3xl" as="h1">
        Settings
      </Heading>
      <FormControl marginBottom={4}>
        <FormLabel>Language</FormLabel>
        <Select value={defaultLanguage} onChange={onLanguageChange}>
          <option value="javascript">Javascript</option>
          <option value="typescript">Typescript</option>
        </Select>
        <FormHelperText>
          This will be the default language when a new note is created. It would
          not affect any existing files. The language of individual files can be
          changed in file settings.
        </FormHelperText>
      </FormControl>
      <ButtonGroup marginTop={12} spacing={4}>
        <Button onClick={saveSettings} colorScheme="primary">
          Save Settings
        </Button>
        {isEditing && (
          <Button onClick={() => navigate("/editor")}>Go Back to Editor</Button>
        )}
      </ButtonGroup>
    </Fragment>
  );
};

export default SettingsScreen;
