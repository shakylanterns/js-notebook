import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { customRender } from "../../test-utils/customRennder";
import Settings from "./Settings";

describe("Settings button works", () => {
  beforeAll(() => {
    jest.mocked(useNavigate()).mockReset();
  });

  it("navigates to settings page when clicked", async () => {
    customRender(<Settings />);
    const text = screen.getByText(/Settings/);
    await userEvent.click(text);
    expect(useNavigate()).toBeCalledWith("/settings");
  });
});
