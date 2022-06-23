import { Box, Heading, Text } from "@chakra-ui/react";
import CreateNewNote from "./CreateNewNote";
import RecentFiles from "./RecentFiles";

const HomeScreen = () => {
  return (
    <Box>
      <Heading marginBottom={24} fontSize="3xl">
        Welcome to
        <Text as="span" color="primary.500" display="block">
          JS Notebook
        </Text>
      </Heading>
      <RecentFiles />
      <CreateNewNote />
    </Box>
  );
};

export default HomeScreen;
