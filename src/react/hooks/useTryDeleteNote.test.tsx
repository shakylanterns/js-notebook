import { useDisclosure, useToast } from "@chakra-ui/react";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { openedFile } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import { notificationObjects, useTryDeleteNote } from "./useTryDeleteNote";

interface Props {
  hasDisclosure: boolean;
}

describe("try delete note hook works", () => {
  const disclosure = useDisclosure();
  beforeEach(() => {
    jest.mocked(useToast()).mockReset();
  });

  const Wrapper = ({ hasDisclosure }: Props) => {
    const { tryDeleteNote } = useTryDeleteNote();
    return (
      <Fragment>
        <button
          onClick={() =>
            hasDisclosure ? tryDeleteNote(disclosure) : tryDeleteNote()
          }
        >
          Click
        </button>
      </Fragment>
    );
  };

  it("gives not saved error when the file is not ever saved", async () => {
    customRender(<Wrapper hasDisclosure={false} />);
    const btn = screen.getByText("Click");

    await userEvent.click(btn);

    expect(useToast()).toBeCalledWith(notificationObjects.notSaved);
  });

  it("gives already delete error when it cannot be deleted", async () => {
    const filepath = "okay.jsnote";
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: filepath,
          settings: {
            defaultLanguage: "javascript",
          },
          title: "",
        })
      );
    });
    jest.mocked(window.electron.deleteNote).mockResolvedValue(false);

    customRender(<Wrapper hasDisclosure={false} />);
    const btn = screen.getByText("Click");

    await userEvent.click(btn);

    expect(useToast()).toBeCalledWith(notificationObjects.repeated(filepath));
  });

  it("redirects user back to home page when delete is successful", async () => {
    act(() => {
      store.dispatch(
        openedFile({
          cells: [],
          filePath: "okay",
          settings: {
            defaultLanguage: "javascript",
          },
          title: "",
        })
      );
    });
    jest.mocked(window.electron.deleteNote).mockResolvedValue(true);

    customRender(<Wrapper hasDisclosure={false} />);
    const btn = screen.getByText("Click");

    await userEvent.click(btn);

    expect(useToast()).toBeCalledWith(notificationObjects.success);
    expect(useNavigate()).toBeCalledWith("/");
  });
});
