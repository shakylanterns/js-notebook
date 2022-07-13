import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { customRender } from "../../test-utils/customRennder";
import { useQuitProgram } from "../hooks/useQuitProgram";
import { useTrySaveFile } from "../hooks/useTrySaveFile";
import SaveBeforeQuitModal from "./SaveBeforeQuitModal";

jest.mock("../hooks/useQuitProgram", () => {
  const func = jest.fn();
  return {
    useQuitProgram: () => ({
      quitProgram: func,
    }),
  };
});

jest.mock("../hooks/useTrySaveFile", () => {
  const func = jest.fn();
  return {
    useTrySaveFile: () => ({
      startSaveFile: func,
    }),
  };
});

describe("save before quit modal works", () => {
  beforeEach(() => {
    jest.mocked(useQuitProgram().quitProgram).mockReset();
  });

  it("really quits when the quit button is clicked", async () => {
    customRender(<SaveBeforeQuitModal show={true} />);
    const quitAnywayBtn = screen.getByText(/quit anyway/i);
    await userEvent.click(quitAnywayBtn);
    expect(useQuitProgram().quitProgram).toBeCalled();
  });

  it("save but do not quit when save button is clicked", async () => {
    customRender(<SaveBeforeQuitModal show={true} />);
    const saveBtn = screen.getByText(/save file/i);
    await userEvent.click(saveBtn);
    expect(useTrySaveFile().startSaveFile).toBeCalled();
    expect(useQuitProgram().quitProgram).not.toBeCalled();
  });
});
