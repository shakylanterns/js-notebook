import { ThemeProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaSave } from "react-icons/fa";
import { theme } from "../theme";
import SidebarIcon from "./SidebarIcon";

const hexToRgb = (c: string) => {
  const splitter = /#(?<r>[\da-f]{2})(?<g>[\da-f]{2})(?<b>[\da-f]{2})/;
  const {
    groups: { r, g, b },
  } = c.match(splitter);
  return `rgb(${Number.parseInt(r)}, ${Number.parseInt(g)}, ${Number.parseInt(
    b
  )})`;
};

describe("icon shows correct colours", () => {
  it("it calls the handler when clicked", async () => {
    const onClick = jest.fn();
    render(<SidebarIcon icon={FaSave} text="save" onClick={onClick} />);
    const text = screen.getByText("save");
    await userEvent.click(text);
    expect(onClick).toBeCalled();
  });

  it("when it is active, it shows primary colour", async () => {
    render(
      <SidebarIcon
        icon={FaSave}
        text="save"
        active
        onClick={() => undefined}
      />,
      {
        wrapper: ({ children }) => (
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        ),
      }
    );
    const flex = screen.getByText("save").parentElement;
    expect(flex).toHaveStyle(`color: ${hexToRgb(theme.colors.primary["600"])}`);
  });
});
