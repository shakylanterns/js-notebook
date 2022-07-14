import { Box, Text } from "@chakra-ui/react";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { useAppDispatch } from "../../redux/hooks";
import { updateCell } from "../../redux/reducers/cells";
import { components } from "../markdown/componentMappings";
import { monacoEditorOptions } from "./editorUtils";

interface Props {
  text: string;
  index: number;
}

const MarkdownCell: React.FC<Props> = ({ text, index }) => {
  const [isTyping, setIsTyping] = useState(false);
  const monacoRef = useRef<editor.IStandaloneCodeEditor>(null);
  // about two lines in height
  const [editorHeight, setEditorHeight] = useState("70px");
  const dispatch = useAppDispatch();

  const onDoubleClick = () => {
    setIsTyping(true);
  };

  const onBlur = () => {
    if (!isTyping) {
      return false;
    }
    dispatch(
      updateCell({
        index,
        text: monacoRef.current.getValue(),
        type: "markdown",
      })
    );
    setIsTyping(false);
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
