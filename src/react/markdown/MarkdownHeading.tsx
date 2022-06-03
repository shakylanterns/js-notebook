import { Heading, TypographyProps } from "@chakra-ui/react";
import { HeadingProps } from "react-markdown/lib/ast-to-react";

type Levels = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingLevels = `h${Levels}`;

const fontSizes: Record<Levels, TypographyProps["fontSize"]> = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "md",
  5: "sm",
  6: "xs",
};

const MarkdownHeading: React.FC<HeadingProps> = ({ level, children }) => {
  return (
    <Heading
      as={`h${level}` as HeadingLevels}
      fontSize={fontSizes[level as Levels]}
      marginTop={3}
      marginBottom={1}
    >
      {children}
    </Heading>
  );
};

export default MarkdownHeading;
