import { Heading, Input } from "@chakra-ui/react";
import { FocusEventHandler, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectTitle, setTitle } from "../../redux/reducers/cells";

const DocumentTitle = () => {
  const title = useAppSelector(selectTitle);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const onInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setIsEditing(false);
    dispatch(setTitle(event.target.value));
  };

  if (isEditing) {
    return (
      <Input
        size={"lg"}
        variant="flushed"
        placeholder="Title..."
        fontSize={"3xl"}
        value={title}
        marginBottom={12}
        onBlur={onInputBlur}
      />
    );
  }

  if (title) {
    return (
      <Heading marginBottom={12} onDoubleClick={() => setIsEditing(true)}>
        {title}
      </Heading>
    );
  }

  return (
    <Heading
      fontStyle={"italic"}
      color="gray.200"
      marginBottom={12}
      onClick={() => setIsEditing(true)}
      fontSize="3xl"
    >
      Untitled Document...
    </Heading>
  );
};

export default DocumentTitle;
