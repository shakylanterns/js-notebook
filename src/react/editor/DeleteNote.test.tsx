import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import DeleteNote from "./DeleteNote";

describe("file settings button works", () => {
  // force restore the original useDisclosure hook
  // probably very bad testing code
  const originalChakra = jest.requireActual("@chakra-ui/react");
  jest.mocked(useDisclosure).mockImplementation(originalChakra.useDisclosure);

  it("shows modal when clicked", async () => {
    customRender(<DeleteNote />);
    const btn = screen.getByText(/delete/i);
    await userEvent.click(btn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
