import { useDisclosure } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { customRender } from "../../test-utils/customRennder";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import SaveBeforeClosingEditor from "./SaveBeforeClosingEditor";

jest.mock("../hooks/useTrySaveFile", () => {
  const func = jest.fn();
  return {
    useTrySaveFile: () => ({
      startSaveFile: func,
    }),
  };
});

describe("save before closing editor works", () => {
  beforeEach(() => {
    jest.mocked(useTrySaveFile().startSaveFile).mockReset();
  });

  it("closes modal when cancel is clicked", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    customRender(<SaveBeforeClosingEditor disclosure={disclosure} />);
    const quitAnywayBtn = screen.getByText(/cancel/i);
    await userEvent.click(quitAnywayBtn);
    expect(disclosure.onClose).toBeCalled();
  });

  it("closes modal and starts saving when save first is clicked", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    customRender(<SaveBeforeClosingEditor disclosure={disclosure} />);
    const saveBtn = screen.getByText(/save first/i);
    await userEvent.click(saveBtn);
    expect(useTrySaveFile().startSaveFile).toBeCalled();
    expect(disclosure.onClose).toBeCalled();
  });

  it("navigate back to home page when do not save is clicked", async () => {
    const disclosure = useDisclosure();
    disclosure.isOpen = true;
    customRender(<SaveBeforeClosingEditor disclosure={disclosure} />);
    const quitAnywayBtn = screen.getByText(/do not save/i);
    await userEvent.click(quitAnywayBtn);
    expect(useNavigate()).toBeCalledWith("/");
    expect(disclosure.onClose).toBeCalled();
  });
});
