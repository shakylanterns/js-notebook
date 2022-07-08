import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import {
  CellContent,
  NoteFile,
  openedFile,
  setFileError,
} from "../../redux/reducers/cells";

const parseContent = (content: string) => {
  const items = JSON.parse(content);
  if (typeof items.title !== "string") {
    throw new Error("Parse Error: Document title is malformed");
  }
  if (!(items.cells instanceof Array)) {
    throw new Error("Parse Error: Cells field is not an array");
  }
  items.cells.forEach((cell: Partial<CellContent>) => {
    if (!cell.type || (cell.type !== "markdown" && cell.type !== "code")) {
      throw new Error("Parse Error: Cell type is invalid");
    }
    if (cell.text === undefined || cell.text === null) {
      throw new Error("Parse Error: Cell has no text");
    }
  });
  return items as NoteFile;
};

export interface OpenFileOptions {
  filePath?: string;
}

export const openFile = async (options: OpenFileOptions) => {
  let _filePath = options.filePath;
  if (!_filePath) {
    const { canceled, filePaths } = await window.electron.loadFilePath();
    if (canceled) {
      throw new Error("cancelled");
    }
    _filePath = filePaths[0];
  }
  const { error, content } = await window.electron.loadFile(_filePath);
  if (error) {
    throw new Error(error);
  }
  return {
    filePath: _filePath,
    content,
  };
};

export const useTryOpenFile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const startOpenFile = async (openFileOptions?: OpenFileOptions) => {
    try {
      const { content, filePath } = await openFile(openFileOptions || {});
      const items = parseContent(content);
      dispatch(openedFile({ filePath, ...items }));
      toast({ title: "File Opened", status: "info" });
      navigate("/editor");
    } catch (err) {
      if (err.message === "cancelled") {
        return;
      } else if (err.message.startsWith("ENOENT")) {
        toast({
          title: "Cannot Open File",
          description: "Perhaps that file is deleted...",
          status: "error",
        });
      } else {
        toast({
          title: "Cannot Open File",
          description: "The file is malformed.",
          status: "error",
        });
      }
      dispatch(setFileError(err.message));
    }
  };

  return { startOpenFile };
};
