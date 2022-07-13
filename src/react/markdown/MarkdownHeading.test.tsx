import { cleanup, render, screen } from "@testing-library/react";
import MarkdownHeading from "./MarkdownHeading";

describe("markdown heading works", () => {
  it("shows the correct tag for each level", () => {
    const text = "testing" as any;
    for (let i = 1; i <= 6; i++) {
      render(<MarkdownHeading level={i} children={text} node={undefined} />);
      const heading = screen.getByText(text);
      expect(heading.tagName).toBe(`H${i}`);
      cleanup();
    }
  });
});
