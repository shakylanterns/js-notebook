import { extendTheme } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";

export const theme = extendTheme({
  colors: {
    primary: defaultTheme.colors.blue,
  },
});
