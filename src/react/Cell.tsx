import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { Fragment, useRef } from "react";
import { getEsbuild } from "../lib/esbuildInit";
import { unpkgFilePlugin } from "../lib/unpkgFilePlugin";

export type CellType = "code" | "markdown";

export interface CellProps {
  type: CellType;
}

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

const Cell: React.FC<CellProps> = ({ type }) => {
  const iframe = useRef<HTMLIFrameElement>();
  const monaco = useRef<editor.IStandaloneCodeEditor>(null);

  const handleEditorOnMount: OnMount = (editor) => {
    monaco.current = editor;
  };

  async function onRunButtonClick() {
    const code = monaco.current?.getValue();
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

  return (
    <div>
      <Editor
        defaultLanguage={type === "code" ? "javascript" : "markdown"}
        onMount={handleEditorOnMount}
        height="400px"
        options={{
          minimap: {
            enabled: false,
          },
          overviewRulerBorder: false,
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
      {type === "code" && (
        <Fragment>
          <button onClick={onRunButtonClick}>Run!</button>
          <iframe ref={iframe} sandbox="allow-scripts"></iframe>
        </Fragment>
      )}
    </div>
  );
};

export default Cell;
