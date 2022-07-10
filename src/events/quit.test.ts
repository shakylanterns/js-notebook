import electron from "electron";
import { Store } from "../lib/Store";
import { ApplicationState } from "./ipcTypes";
import { quit } from "./quit";
describe("quit works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;
  const stateStore = new Store<ApplicationState>("app");
  const spySave = jest.spyOn(stateStore, "save");

  it("saves application state and quit", async () => {
    const noop = jest.fn();
    await quit(unusedObject, {}, noop, stateStore);
    expect(spySave).toHaveBeenCalled();
    expect(electron.app.quit).toHaveBeenCalled();
    expect(noop).toHaveBeenCalled();
  });

  it("if save errored, still quit the program", async () => {
    const noop = jest.fn();
    jest.mocked(electron.app.quit).mockReset();
    spySave.mockRejectedValue(new Error("unexpected!!"));
    await quit(unusedObject, {}, noop, stateStore);
    expect(noop).toHaveBeenCalled();
    expect(electron.app.quit).toHaveBeenCalled();
  });
});
