import { Link, ListItem, Text } from "@chakra-ui/react";
import { FaMinus } from "react-icons/fa";
import { breakdownFileName, getFileName } from "../../lib/fileNameUtils";
import { useAppDispatch } from "../../redux/hooks";
import { removeRecentFile } from "../../redux/reducers/cells";
import { useTryOpenFile } from "../hooks/useTryOpenFile";

type Props = {
  rf: string;
};

const RecentFile: React.FC<Props> = ({ rf }) => {
  const dispatch = useAppDispatch();
  const { startOpenFile } = useTryOpenFile();
  function onLinkClick() {
    startOpenFile({ filePath: rf });
  }

  function onTrashIconClick() {
    dispatch(removeRecentFile(rf));
  }

  return (
    <ListItem marginLeft={0} marginBottom={1}>
      <Link onClick={onLinkClick} color="blue.300" marginRight={4}>
        {breakdownFileName(getFileName(rf)).name || "[no file name]"}
      </Link>
      <Text color="gray.300" fontSize={"sm"} as="span" marginRight={2}>
        {rf}
      </Text>
      <Text
        color="red.500"
        display="inline-block"
        onClick={onTrashIconClick}
        cursor="pointer"
      >
        <FaMinus display="inline-block" />
      </Text>
    </ListItem>
  );
};

export default RecentFile;
