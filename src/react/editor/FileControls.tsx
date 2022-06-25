import { ButtonGroup } from "@chakra-ui/react";
import DeleteNote from "./DeleteNote";
import FileSettings from "./FileSettings";

const FileControls = () => {
  return (
    <ButtonGroup size="sm" position="absolute" top={0} right={0}>
      <DeleteNote />
      <FileSettings />
    </ButtonGroup>
  );
};

export default FileControls;
