import { CellContent } from "../../redux/reducers/cells";
import CellContainer from "./CellContainer";
import CodeCell from "./CodeCell";
import MarkdownCell from "./MarkdownCell";

export interface CellProps {
  cell: CellContent;
  index: number;
}

const Cell: React.FC<CellProps> = ({ cell, index }) => {
  const { text, type } = cell;

  let cellComponent = null;
  if (type === "code") {
    cellComponent = <CodeCell text={text} index={index} />;
  } else {
    cellComponent = <MarkdownCell text={text} index={index} />;
  }

  return <CellContainer index={index}>{cellComponent}</CellContainer>;
};

export default Cell;
