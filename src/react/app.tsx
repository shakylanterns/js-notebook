import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { useMonaco } from "@monaco-editor/react";
import githubTheme from "monaco-themes/themes/GitHub Light.json";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { initEsbuild } from "../lib/esbuildInit";
import { store } from "../redux/store";
import Editor from "./editor/Editor";
import HomeScreen from "./home/HomeScreen";
import SaveBeforeQuitModal from "./modals/SaveBeforeQuitModal";
import "./patch.css";
import SavedStateInitializer from "./SavedStateInitializer";
import SettingsScreen from "./settings/SettingsScreen";
import Sidebar from "./sidebar/Sidebar";
import { theme } from "./theme";

const App = () => {
  const monaco = useMonaco();

  useEffect(() => {
    initEsbuild();

    // setup monaco themes
    monaco.editor.defineTheme("github-light", githubTheme as any);
  }, []);

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Flex>
          <HashRouter>
            <SavedStateInitializer />
            <Sidebar />
            <Box
              flexGrow={1}
              paddingX={8}
              paddingTop={12}
              maxWidth="90vw"
              minHeight="100vh"
            >
              <Routes>
                <Route element={<Editor />} path="/editor" />
                <Route element={<SettingsScreen />} path="/settings" />
                <Route element={<HomeScreen />} path="/*" />
              </Routes>
            </Box>
          </HashRouter>
        </Flex>
        <SaveBeforeQuitModal />
      </ChakraProvider>
    </Provider>
  );
};

export default App;
