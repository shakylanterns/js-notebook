import CellContainer from "./CellContainer";
import CodeCell from "./CodeCell";
import MarkdownCell from "./MarkdownCell";

export type CellType = "code" | "markdown";

export interface CellProps {
  type: CellType;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  let cell = null;
  if (type === "code") {
    cell = <CodeCell />;
  } else {
    cell = <MarkdownCell />;
  }

  return <CellContainer>{cell}</CellContainer>;
};

export default Cell;
