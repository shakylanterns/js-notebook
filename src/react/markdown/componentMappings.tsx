import {
  Box,
  Checkbox,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import { HeadingComponent } from "react-markdown/lib/ast-to-react";
import MarkdownHeading from "./MarkdownHeading";

import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";

export type ComponentOptions = ReactMarkdownOptions["components"];

export const headingFunction: HeadingComponent = (props) => (
  <MarkdownHeading {...props} />
);

export const quoteFunction: ComponentOptions["blockquote"] = ({ children }) => (
  // children is either a list of paragraphs tags, or just a single one
  // but I cannot find anything from the documentation
  <Box backgroundColor="primary.50" paddingY={4} paddingX={6} marginY={4}>
    {children}
  </Box>
);

export const listFunction: ComponentOptions["ul"] = ({ children }) => {
  return <UnorderedList marginY={6}>{children}</UnorderedList>;
};

export const orderedListFunction: ComponentOptions["ol"] = ({ children }) => {
  return <OrderedList marginY={6}>{children}</OrderedList>;
};

export const listItemFunction: ComponentOptions["li"] = ({
  children,
  checked,
}) => {
  // there is gfm
  if (checked !== null) {
    return (
      <ListItem display="flex" alignItems="center" gap={2}>
        <Checkbox defaultChecked={checked} disabled={true} />
        {children[2]}
      </ListItem>
    );
  } else {
    return <ListItem>{children}</ListItem>;
  }
};

export const tableFunction: ComponentOptions["table"] = ({ children }) => {
  return (
    <Table variant={"striped"} colorScheme="primary" size="md" marginY={6}>
      {children}
    </Table>
  );
};

export const tableHeadingFunction: ComponentOptions["th"] = ({
  children,
  style,
}) => {
  return <Th style={style}>{children}</Th>;
};

export const tableRowFunction: ComponentOptions["tr"] = ({ children }) => {
  return <Tr>{children}</Tr>;
};

export const tableDataFunction: ComponentOptions["td"] = ({
  children,
  style,
}) => {
  return <Td style={style}>{children}</Td>;
};

export const anchorFunction: ComponentOptions["a"] = ({ children }) => {
  return <Link color="primary.800">{children}</Link>;
};

export const components: ReactMarkdownOptions["components"] = {
  h1: headingFunction,
  h2: headingFunction,
  h3: headingFunction,
  h4: headingFunction,
  h5: headingFunction,
  h6: headingFunction,
  blockquote: quoteFunction,
  ul: listFunction,
  li: listItemFunction,
  ol: orderedListFunction,
  th: tableHeadingFunction,
  tr: tableRowFunction,
  td: tableDataFunction,
  table: tableFunction,
  tbody: Tbody,
  thead: Thead,
  tfoot: Tfoot,
  a: anchorFunction,
};
