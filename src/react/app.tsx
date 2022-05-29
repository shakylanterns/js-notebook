import { ChakraProvider, Flex } from "@chakra-ui/react";
import { useMonaco } from "@monaco-editor/react";
import githubTheme from "monaco-themes/themes/GitHub Light.json";
import { useEffect } from "react";
import { initEsbuild } from "../lib/esbuildInit";
import Editor from "./Editor";
import "./patch.css";
import Sidebar from "./Sidebar";

const App = () => {
  const monaco = useMonaco();

  useEffect(() => {
    initEsbuild();

    // setup monaco themes
    monaco.editor.defineTheme("github-light", githubTheme as any);
  }, []);

  return (
    <ChakraProvider>
      <Flex>
        <Sidebar />
        <Editor />
      </Flex>
    </ChakraProvider>
  );
};

export default App;
