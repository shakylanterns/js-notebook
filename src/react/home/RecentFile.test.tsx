import { UnorderedList } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import { useTryOpenFile } from "../hooks/useTryOpenFile";
import RecentFile from "./RecentFile";

jest.mock("../hooks/useTryOpenFile", () => {
  const func = jest.fn();
  return {
    useTryOpenFile: () => ({
      startOpenFile: func,
    }),
  };
});

describe("recent file display", () => {
  it("shows itself correctly", () => {
    customRender(
      <UnorderedList>
        <RecentFile rf="/index.jsnote" />
      </UnorderedList>
    );
    const filename = screen.getByText(/index$/);
    expect(filename).toBeInTheDocument();
  });

  it("calls open file when clicked", async () => {
    customRender(
      <UnorderedList>
        <RecentFile rf="/index.jsnote" />
      </UnorderedList>
    );
    const filename = screen.getByText(/index$/);
    await userEvent.click(filename);
    expect(useTryOpenFile().startOpenFile).toBeCalled();
  });
});
