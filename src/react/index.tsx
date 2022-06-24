import { createRoot } from "react-dom/client";
import App from "./app";

export function render() {
  const rootContainer = document.querySelector("#root") as HTMLDivElement;
  const root = createRoot(rootContainer);
  root.render(<App />);
}
