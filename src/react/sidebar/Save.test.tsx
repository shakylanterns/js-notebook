import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import Save from "./Save";

// it has been tested already, mock the entire thing for convenience
jest.mock("../hooks/useTrySaveFile", () => {
  const func = jest.fn();
  return {
    useTrySaveFile: () => ({
      startSaveFile: func,
    }),
  };
});

describe("Save button works", () => {
  beforeAll(() => {
    jest.mocked(useTrySaveFile().startSaveFile).mockReset();
    jest.mocked(useDisclosure().onOpen).mockReset();
  });

  it("saves the file", async () => {
    customRender(<Save />);
    const text = screen.getByText(/Save/);
    await userEvent.click(text);
    expect(useDisclosure().onOpen).not.toBeCalled();
    expect(useTrySaveFile().startSaveFile).toBeCalledWith({
      ignoreCurrentFilePath: false,
    });
  });
});
