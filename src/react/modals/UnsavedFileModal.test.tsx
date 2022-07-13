import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import UnsavedFileModal from "./UnsavedFileModal";

describe("unsaved file modal works", () => {
  it("only calls close when close button is clicked", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    const startOpenFile = jest.fn();
    customRender(
      <UnsavedFileModal disclosure={disclosure} startOpenFile={startOpenFile} />
    );
    const closeBtn = screen.getByText(/close/i);
    await userEvent.click(closeBtn);
    expect(disclosure.onClose).toBeCalled();
    expect(startOpenFile).not.toBeCalled();
  });

  it("calls start open file when continue button is clicked", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    const startOpenFile = jest.fn();
    customRender(
      <UnsavedFileModal disclosure={disclosure} startOpenFile={startOpenFile} />
    );
    const closeBtn = screen.getByText(/^continue$/i);
    await userEvent.click(closeBtn);
    expect(disclosure.onClose).toBeCalled();
    expect(startOpenFile).toBeCalled();
  });
});
