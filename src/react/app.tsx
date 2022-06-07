import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useMonaco } from "@monaco-editor/react";
import githubTheme from "monaco-themes/themes/GitHub Light.json";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { initEsbuild } from "../lib/esbuildInit";
import { store } from "../redux/store";
import Editor from "./editor/Editor";
import "./patch.css";
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
          <Sidebar />
          <Editor />
        </Flex>
      </ChakraProvider>
    </Provider>
  );
};

export default App;
