import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { startEditor } from "../../redux/reducers/cells";

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  const onNewNoteBtnClick = () => {
    dispatch(startEditor());
  };

  return (
    <Box>
      <Heading marginBottom={24} fontSize="3xl">
        Welcome to
        <Text as="span" color="primary.500" display="block">
          JS Notebook
        </Text>
      </Heading>
      <Box marginBottom={24}>
        <Heading as="h2" fontSize="xl" fontWeight="normal">
          Recent Files
        </Heading>
      </Box>
      <Box>
        <Button
          colorScheme="primary"
          leftIcon={<FaPlus />}
          size="md"
          onClick={onNewNoteBtnClick}
        >
          Create New Note
        </Button>
      </Box>
    </Box>
  );
};

export default HomeScreen;
