import { Box, Heading, Text, UnorderedList } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import { selectRecentFiles } from "../../redux/reducers/cells";
import RecentFile from "./RecentFile";

const RecentFiles = () => {
  const recentFiles = useAppSelector(selectRecentFiles);
  return (
    <Box marginBottom={24}>
      <Heading as="h2" fontSize="xl" fontWeight="normal" marginBottom={3}>
        Recent Files
      </Heading>
      {recentFiles.length ? (
        <UnorderedList listStyleType="none" marginLeft={0}>
          {recentFiles.map((rf, index) => {
            return <RecentFile rf={rf} key={`rf-${index}`} />;
          })}
        </UnorderedList>
      ) : (
        <Text color="gray.400">No Recent Files...</Text>
      )}
    </Box>
  );
};

export default RecentFiles;
