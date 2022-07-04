import { app } from "electron";
import { describe, expect, it, vi } from "vitest";
import { Store } from "../lib/Store";
import { ApplicationState } from "./ipcTypes";
import { quit } from "./quit";

describe("quit works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;
  const stateStore = new Store<ApplicationState>("app");
  const spySave = vi.spyOn(stateStore, "save");
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  it("saves application state and quit", async () => {
    const noop = vi.fn();
    await quit(unusedObject, {}, noop, stateStore);
    expect(spySave).toHaveBeenCalledOnce();
    expect(app.quit).toHaveBeenCalledOnce();
    expect(noop).toHaveBeenCalledOnce();
  });

  it("if save errored, still quit the program", async () => {
    const noop = vi.fn();
    vi.mocked(app.quit).mockReset();
    spySave.mockRejectedValue(new Error("unexpected!!"));
    await quit(unusedObject, {}, noop, stateStore);
    expect(noop).toHaveBeenCalledOnce();
    expect(app.quit).toHaveBeenCalledOnce();
  });
});
