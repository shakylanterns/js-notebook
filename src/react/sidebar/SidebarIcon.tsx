import { Flex, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  text: string;
  active?: boolean;
  onClick?: MouseEventHandler;
};

const SidebarIcon = ({ icon: Icon, text, active, onClick }: Props) => {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      _hover={{ color: "primary.600" }}
      color={active && "primary.600"}
      cursor="pointer"
      width="100%"
      paddingX={3}
      onClick={onClick}
    >
      <Icon size={20} />
      <Text marginTop={1} fontSize="sm">
        {text}
      </Text>
    </Flex>
  );
};

export default SidebarIcon;
