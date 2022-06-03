import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const CellContainer = ({ children }: Props) => {
  return (
    <Box
      borderLeftWidth={12}
      borderLeftColor="transparent"
      _hover={{ borderLeftColor: "primary.600" }}
      paddingLeft={8}
      marginBottom={12}
    >
      {children}
    </Box>
  );
};

export default CellContainer;
