import { Box, ButtonGroup, IconButton } from "@chakra-ui/react";
import React from "react";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteCell,
  selectCellsLen,
  shiftCellAfter,
  shiftCellBefore,
} from "../../redux/reducers/cells";

type Props = {
  children: React.ReactNode;
  index: number;
};

const CellContainer = ({ children, index }: Props) => {
  const cellsLength = useAppSelector(selectCellsLen);
  const dispatch = useAppDispatch();

  function onArrowUpBtnClick() {
    dispatch(shiftCellBefore(index));
  }

  function onArrowDownBtnClick() {
    dispatch(shiftCellAfter(index));
  }

  function onTrashBtnClick() {
    dispatch(deleteCell(index));
  }

  return (
    <Box
      borderLeftWidth={12}
      borderLeftColor="transparent"
      _hover={{ borderLeftColor: "primary.600" }}
      paddingLeft={8}
      position="relative"
    >
      <ButtonGroup
        position="absolute"
        top={0}
        left="95%"
        zIndex={100}
        // _hover={{ opacity: 1 }}
        // opacity={0}
      >
        {index !== 0 && (
          <IconButton
            onClick={onArrowUpBtnClick}
            icon={<FaArrowUp />}
            aria-label={"move up"}
            size="xs"
          />
        )}
        {cellsLength !== 0 && index !== cellsLength - 1 && (
          <IconButton
            onClick={onArrowDownBtnClick}
            icon={<FaArrowDown />}
            aria-label={"move down"}
            size="xs"
          />
        )}
        <IconButton
          onClick={onTrashBtnClick}
          icon={<FaTrash />}
          aria-label={"delete"}
          size="xs"
          colorScheme="red"
        />
      </ButtonGroup>
      {children}
    </Box>
  );
};

export default CellContainer;
