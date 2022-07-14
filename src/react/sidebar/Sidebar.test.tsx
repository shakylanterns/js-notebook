import { screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { startEditor } from "../../redux/reducers/cells";
import { store } from "../../redux/store";
import { customRender } from "../../test-utils/customRennder";
import Sidebar from "./Sidebar";

describe("sidebar works", () => {
  it("does not show editor functions when not in edit mode", () => {
    customRender(<Sidebar />);
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/save as/i)).not.toBeInTheDocument();
  });

  it("shows editor functions when in edit mode", () => {
    act(() => {
      store.dispatch(startEditor());
    });
    customRender(<Sidebar />);
    expect(screen.getByText(/save$/i)).toBeInTheDocument();
    expect(screen.getByText(/save as/i)).toBeInTheDocument();
  });
});
