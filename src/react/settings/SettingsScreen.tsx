import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Select,
} from "@chakra-ui/react";
import { ChangeEventHandler, useState } from "react";
import { Languages } from "../../ipcTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAppSettings, setSettings } from "../../redux/reducers/app";
import { useNotification } from "../NotificationContext";

const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectAppSettings);
  const [defaultLanguage, setDefaultLanguage] = useState(
    settings.defaultLanguage
  );
  const { createNotification } = useNotification();

  const onLanguageChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDefaultLanguage(event.target.value as Languages);
  };

  async function saveSettings() {
    dispatch(setSettings({ defaultLanguage }));
    const success = await window.electron.saveSettings({ defaultLanguage });
    if (success) {
      createNotification("Settings Saved", "success");
    } else {
      createNotification("Settings cannot be saved", "error");
    }
  }

  return (
    <Box
      flexGrow={1}
      paddingX={8}
      paddingTop={12}
      maxWidth="90vw"
      minHeight="100vh"
    >
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
      <Button onClick={saveSettings} colorScheme="primary" marginTop={12}>
        Save Settings
      </Button>
    </Box>
  );
};

export default SettingsScreen;
