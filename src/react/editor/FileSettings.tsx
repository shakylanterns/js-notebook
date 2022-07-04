import { Button, useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaCog } from "react-icons/fa";
import { FileSettings } from "../../events/ipcTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectFilePath, setFileSettings } from "../../redux/reducers/cells";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import FileSettingsModal from "../modals/FileSettingsModal";

const FileSettings = () => {
  const disclosure = useDisclosure();
  const dispatch = useAppDispatch();
  const { startSaveFile } = useTrySaveFile();
  const filePath = useAppSelector(selectFilePath);
  function onFileSettingssBtnClick() {
    disclosure.onOpen();
  }

  async function setFileSettingsCallback(settings: FileSettings) {
    dispatch(setFileSettings(settings));
    if (filePath) {
      await startSaveFile({ ignoreCurrentFilePath: false, settings });
    }
    disclosure.onClose();
  }

  return (
    <Fragment>
      <FileSettingsModal
        disclosure={disclosure}
        setFileSettings={setFileSettingsCallback}
      />
      <Button onClick={onFileSettingssBtnClick} leftIcon={<FaCog />}>
        File Settings
      </Button>
    </Fragment>
  );
};

export default FileSettings;
