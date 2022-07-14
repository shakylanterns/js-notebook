import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import CreateNewNote from "./CreateNewNote";

// The testing cases for the modal itself are not covered here
describe("create new note works when clicked", () => {
  // force restore the original useDisclosure hook
  // probably very bad testing code
  const originalChakra = jest.requireActual("@chakra-ui/react");
  jest.mocked(useDisclosure).mockImplementation(originalChakra.useDisclosure);

  it("creates the modal when clicked", async () => {
    customRender(<CreateNewNote />);
    const btn = screen.getByText(/create new/i);
    await userEvent.click(btn);
    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });
});
