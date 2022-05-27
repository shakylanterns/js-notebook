import { ChangeEvent, useRef, useState } from "react";
import { getEsbuild } from "../lib/esbuildInit";
import { unpkgFilePlugin } from "../lib/unpkgFilePlugin";

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

const Cell = () => {
  const [code, setCode] = useState("");
  const iframe = useRef<HTMLIFrameElement>();

  function onTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCode(event.target.value);
  }

  async function onRunButtonClick() {
    if (!iframe.current) {
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
      <textarea onChange={onTextareaChange} value={code}></textarea>
      <button onClick={onRunButtonClick}>Run!</button>
      <iframe ref={iframe} sandbox="allow-scripts"></iframe>
    </div>
  );
};

export default Cell;
