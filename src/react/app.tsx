import { useEffect } from "react";
import { initEsbuild } from "../lib/esbuildInit";
import Cell from "./Cell";

const App = () => {
  useEffect(() => {
    initEsbuild();
  }, []);

  return (
    <div>
      <Cell />
    </div>
  );
};

export default App;
