import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useMonaco } from "@monaco-editor/react";
import githubTheme from "monaco-themes/themes/GitHub Light.json";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { initEsbuild } from "../lib/esbuildInit";
import { store } from "../redux/store";
import EditingArea from "./EditingArea";
import SaveBeforeQuitModal from "./modals/SaveBeforeQuitModal";
import NotificationProvier from "./NotificationContext";
import "./patch.css";
import SavedStateInitializer from "./SavedStateInitializer";
import SettingsScreen from "./settings/SettingsScreen";
import Sidebar from "./sidebar/Sidebar";
import { theme } from "./theme";

const App = () => {
  const monaco = useMonaco();
  const [inSettingsPage, setInSettingsPage] = useState(false);

  useEffect(() => {
    initEsbuild();

    // setup monaco themes
    monaco.editor.defineTheme("github-light", githubTheme as any);
  }, []);

  return (
    <Provider store={store}>
      <SavedStateInitializer />
      <ChakraProvider theme={theme}>
        <NotificationProvier>
          <Flex>
            <Sidebar
              goToSettingsPage={() => setInSettingsPage(true)}
              goToHomePage={() => setInSettingsPage(false)}
            />
            {inSettingsPage ? (
              <SettingsScreen
                exitSettingsPage={() => setInSettingsPage(false)}
              />
            ) : (
              <EditingArea />
            )}
          </Flex>
        </NotificationProvier>
        <SaveBeforeQuitModal />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
