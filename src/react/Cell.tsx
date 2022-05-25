import { ChangeEvent, useState } from "react";
import { getEsbuild } from "../lib/esbuildInit";
import { unpkgFilePlugin } from "../lib/unpkgFilePlugin";

const Cell = () => {
  const [code, setCode] = useState("");
  const [bundled, setBundled] = useState("");

  function onTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCode(event.target.value);
  }

  async function onRunButtonClick() {
    console.log("start bundling...");
    const result = await (
      await getEsbuild()
    ).build({
      entryPoints: ["index.js"],
      bundle: true,
      outfile: "out.js",
      plugins: [unpkgFilePlugin(code)],
    });
    setBundled(result.outputFiles[0].text);
  }

  return (
    <div>
      <textarea onChange={onTextareaChange} value={code}></textarea>
      <pre>{bundled}</pre>
      <button onClick={onRunButtonClick}>Run!</button>
    </div>
  );
};

export default Cell;
