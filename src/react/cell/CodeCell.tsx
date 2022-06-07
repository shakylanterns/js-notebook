import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import { getEsbuild } from "../../lib/esbuildInit";
import { unpkgFilePlugin } from "../../lib/unpkgFilePlugin";
import { useAppDispatch } from "../../redux/hooks";
import { updateCell } from "../../redux/reducers/cells";
import { monacoEditorOptions } from "./editorUtils";

const IFRMAE_HTML = `
  <html>
    <head>
      <title>JS Notebook Iframe</title>
      <style>
        #error {
          font-size: 1.5rem;
          color: red;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const root = document.getElementById("root");
        const setError = (type, text) => {
          root.innerHTML = '<h2 id="error">' + type + " : " + text + '</h2>';
        };

        // this will catch all synchronous errors
        window.addEventListener("message", ({ data: { code, error } }) => {
          if (error) {
            setError("Build Error", error);
            return;
          }
          try {
            // this is not too dangerous since it is in an iframe.
            eval(code);
          } catch (err) {
            setError("Runtime Error", err.message);
          }
        });

        // uncaught errors (e.g. promises)
        window.addEventListener("error", ({ error }) => {
          event.preventDefault();
          setError("Runtime Error", error);
        });
      </script>
    </body>
  </html>
  `;

interface Props {
  text: string;
  index: number;
}

const CodeCell: React.FC<Props> = ({ text, index }) => {
  const iframe = useRef<HTMLIFrameElement>();
  const monacoRef = useRef<editor.IStandaloneCodeEditor>(null);
  // this state is only useful in code mode
  const [isRunning, setIsRunning] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // about two lines in height
  const [editorHeight, setEditorHeight] = useState("70px");
  const dispatch = useAppDispatch();

  const onBlur = () => {
    if (!isTyping) {
      return false;
    }
    setIsTyping(false);
    dispatch(
      updateCell({
        index,
        text: monacoRef.current.getValue(),
        type: "code",
      })
    );
  };

  const handleEditorOnMount: OnMount = (editorInstance) => {
    monacoRef.current = editorInstance;
    monacoRef.current.setValue(text);
    monacoRef.current.getModel()?.updateOptions({
      tabSize: 2,
      indentSize: 2,
      insertSpaces: true,
      trimAutoWhitespace: true,
    });
    editorInstance.onDidContentSizeChange(() => {
      const contentHeight = Math.min(monacoRef.current.getContentHeight(), 800);
      setEditorHeight(contentHeight + "px");
    });
  };

  async function onRunButtonClick() {
    setIsRunning(true);
    const code = monacoRef.current?.getValue();
    if (!iframe.current || !code) {
      return false;
    }
    iframe.current.srcdoc = IFRMAE_HTML;
    try {
      const result = await (
        await getEsbuild()
      ).build({
        entryPoints: ["index.js"],
        bundle: true,
        outfile: "out.js",
        plugins: [unpkgFilePlugin(code)],
        define: {
          // better error messages from packages
          // the code snippets are not made for production anyway
          "process.env.NODE_ENV": '"development"',
          global: "window",
        },
      });
      const text = result.outputFiles[0].text;
      // send the bundled code to the iframe
      setTimeout(() => {
        iframe.current.contentWindow.postMessage(
          { code: text, error: null },
          "*"
        );
      }, 100);
    } catch (err) {
      // send error to the iframe
      setTimeout(() => {
        iframe.current.contentWindow.postMessage(
          // only the error message will be shown
          // but not the line numbers in esbuild
          { code: null, error: err.message.split(":").pop() },
          "*"
        );
      }, 100);
    }
  }

  function onStopButtonClick() {
    setIsRunning(false);
  }

  return (
    <Box onFocus={() => setIsTyping(true)} onBlur={onBlur}>
      <Box display="block" marginLeft={-4}>
        <Editor
          defaultLanguage={"javascript"}
          height={editorHeight}
          onMount={handleEditorOnMount}
          options={monacoEditorOptions()}
        />
      </Box>
      <ButtonGroup>
        <Button
          onClick={onRunButtonClick}
          marginTop={4}
          size="sm"
          disabled={isRunning}
        >
          Run!
        </Button>
        <Button
          onClick={onStopButtonClick}
          marginTop={4}
          size="sm"
          disabled={!isRunning}
        >
          Stop
        </Button>
      </ButtonGroup>
      <Box
        borderWidth={0.5}
        borderColor="gray.400"
        display={isRunning ? "block" : "none"}
        marginTop={4}
      >
        <iframe ref={iframe} sandbox="allow-scripts"></iframe>
      </Box>
    </Box>
  );
};

export default CodeCell;
