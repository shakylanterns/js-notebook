import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import DeleteConfirm from "./DeleteConfirm";

describe("delete confirm works", () => {
  beforeEach(() => {
    jest.mocked(useDisclosure().onClose).mockReset();
  });

  it("closes when cancelled", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    customRender(
      <DeleteConfirm disclosure={disclosure} deleteNote={() => undefined} />
    );
    const cancelBtn = screen.getByText(/cancel/i);
    await userEvent.click(cancelBtn);
    expect(disclosure.onClose).toBeCalled();
  });

  it("calls deleteNote when confirmed", async () => {
    const deleteNote = jest.fn();
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    customRender(
      <DeleteConfirm disclosure={disclosure} deleteNote={deleteNote} />
    );
    const cancelBtn = screen.getByText(/yes/i);
    await userEvent.click(cancelBtn);
    expect(deleteNote).toBeCalled();
  });
});
