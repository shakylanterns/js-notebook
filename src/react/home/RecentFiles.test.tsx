import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { selectRecentFiles, setRecentFiles } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import RecentFiles from "./RecentFiles";

describe("recent file display", () => {
  it("shows itself correctly", () => {
    act(() => {
      store.dispatch(setRecentFiles(["/a.jsnote", "/b.jsnote", "/c.jsnote"]));
    });
    customRender(<RecentFiles />);
    const filepaths = screen.queryAllByText(/jsnote$/);
    expect(filepaths.length).toBe(3);
  });

  it("calls open file when clicked", async () => {
    act(() => {
      store.dispatch(setRecentFiles(["/a.jsnote", "/b.jsnote", "/c.jsnote"]));
    });
    const { container } = customRender(<RecentFiles />);
    const trash = container.querySelectorAll("svg");
    // a.jsnote's delete button
    await userEvent.click(trash[0]);
    expect(selectRecentFiles(store.getState())).toEqual([
      "/b.jsnote",
      "/c.jsnote",
    ]);
  });
});
