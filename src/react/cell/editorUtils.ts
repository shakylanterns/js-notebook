import { editor } from "monaco-editor";

export const monacoEditorOptions =
  (): editor.IStandaloneDiffEditorConstructionOptions => {
    return {
      theme: "github-light",
      minimap: {
        enabled: false,
      },
      overviewRulerBorder: false,
      bracketPairColorization: {
        enabled: true,
      },
      padding: {
        bottom: 0,
        top: 0,
      },
      lineNumbers: "off",
      glyphMargin: false,
      wordWrap: "on",
      overviewRulerLanes: 0,
      scrollbar: {
        vertical: "hidden",
      },
      lineDecorationsWidth: 0,
      scrollBeyondLastLine: false,
    };
  };
