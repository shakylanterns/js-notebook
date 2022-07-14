import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import {
  addCell,
  deleteNote,
  openedFile,
  selectCells,
} from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import AddCell from "./AddCell";

describe("file settings button works", () => {
  beforeEach(() => {
    act(() => {
      // reset every value
      store.dispatch(deleteNote());
    });
  });

  it("adds markdown cell correctly at the front", async () => {
    customRender(<AddCell index={0} lastIndex={0} />);
    const btn = screen.getByText(/add text/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([
      { text: "", type: "markdown" },
    ]);
  });

  it("adds code cell correctly at the front", async () => {
    customRender(<AddCell index={0} lastIndex={0} />);
    const btn = screen.getByText(/add snippet/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([{ text: "", type: "code" }]);
  });

  it("adds markdown cell correctly to the middle", async () => {
    act(() => {
      store.dispatch(
        openedFile({
          cells: [
            { text: "hello", type: "code" },
            { text: "world", type: "code" },
          ],
          filePath: "",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });
    // force it to show by setting index === lastIndex
    customRender(<AddCell index={1} lastIndex={1} />);
    const btn = screen.getByText(/add text/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([
      { text: "hello", type: "code" },
      { text: "", type: "markdown" },
      { text: "world", type: "code" },
    ]);
  });

  it("adds code cell correctly to the middle", async () => {
    act(() => {
      store.dispatch(
        openedFile({
          cells: [
            { text: "hello", type: "markdown" },
            { text: "world", type: "markdown" },
          ],
          filePath: "",
          settings: { defaultLanguage: "javascript" },
          title: "",
        })
      );
    });
    // force it to show by setting index === lastIndex
    customRender(<AddCell index={1} lastIndex={1} />);
    const btn = screen.getByText(/add snippet/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([
      { text: "hello", type: "markdown" },
      { text: "", type: "code" },
      { text: "world", type: "markdown" },
    ]);
  });

  it("adds markdown cell correctly to the back", async () => {
    act(() => {
      store.dispatch(addCell({ index: 0, type: "code" }));
    });
    // force it to show by setting index === lastIndex
    customRender(<AddCell index={1} lastIndex={1} />);
    const btn = screen.getByText(/add text/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([
      { text: "", type: "code" },
      { text: "", type: "markdown" },
    ]);
  });

  it("adds code cell correctly to the back", async () => {
    act(() => {
      store.dispatch(addCell({ index: 0, type: "markdown" }));
    });
    // force it to show by setting index === lastIndex
    customRender(<AddCell index={1} lastIndex={1} />);
    const btn = screen.getByText(/add snippet/i);
    await userEvent.click(btn);
    expect(selectCells(store.getState())).toEqual([
      { text: "", type: "markdown" },
      { text: "", type: "code" },
    ]);
  });
});
