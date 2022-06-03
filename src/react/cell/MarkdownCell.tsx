import { Box, Text } from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import "katex/dist/katex.min.css";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { components } from "../markdown/componentMappings";
import { monacoEditorOptions } from "./editorUtils";

const MarkdownCell = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const monacoRef = useRef<editor.IStandaloneCodeEditor>(null);
  // about two lines in height
  const [editorHeight, setEditorHeight] = useState("70px");

  const onDoubleClick = () => {
    setIsTyping(true);
  };

  const onBlur = () => {
    if (!isTyping) {
      return false;
    }
    setText(monacoRef.current.getValue());
    setIsTyping(false);
  };

  const handleEditorOnMount: OnMount = (editorInstance) => {
    monacoRef.current = editorInstance;
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

  const editorBox = (
    <Box display="block" marginLeft={-4} onBlur={onBlur}>
      <Editor
        defaultLanguage={"markdown"}
        height={editorHeight}
        onMount={handleEditorOnMount}
        options={monacoEditorOptions()}
        defaultValue={text}
      />
    </Box>
  );

  const markdownBox = (
    <Box onDoubleClick={onDoubleClick}>
      {text ? (
        <ReactMarkdown
          components={components}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {text}
        </ReactMarkdown>
      ) : (
        <Text color="gray.300" fontStyle="italic">
          Double click to type something...
        </Text>
      )}
    </Box>
  );

  return <Box minHeight={16}>{isTyping ? editorBox : markdownBox}</Box>;
};

export default MarkdownCell;
