import { Store } from "../lib/Store";
import { getApplicationState } from "./getApplicationState";
import { ApplicationState } from "./ipcTypes";
describe("get application state works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;
  const stateStore = new Store<ApplicationState>("app");
  const spyOpen = jest.spyOn(stateStore, "open");

  it("returns the correct if file exists", async () => {
    const resultObj: ApplicationState = {
      openedFilePath: "",
      scrollPosition: 1,
      recentFiles: [],
    };
    // simulate correct read file
    spyOpen.mockResolvedValue(resultObj);
    const result = await getApplicationState(unusedObject, stateStore);

    expect(result).toEqual(resultObj);
  });

  it("returns null on error", async () => {
    // simulate file cannot be opened
    spyOpen.mockRejectedValue(new Error("hi"));

    const result = await getApplicationState(unusedObject, stateStore);

    expect(result).toBe(null);
  });
});
