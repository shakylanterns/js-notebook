import { describe, expect, it, vi } from "vitest";
import { Store } from "../lib/Store";
import { getApplicationState } from "./getApplicationState";
import { ApplicationSettings } from "./ipcTypes";

describe("get settings works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;
  const settingsStore = new Store<ApplicationSettings>("app");
  const spyOpen = vi.spyOn(settingsStore, "open");

  it("returns the correct if file exists", async () => {
    const resultObj: ApplicationSettings = {
      defaultLanguage: "typescript",
    };
    // simulate correct read file
    spyOpen.mockResolvedValue(resultObj);
    const result = await getApplicationState(unusedObject, settingsStore);

    expect(result).toEqual(resultObj);
  });

  it("returns null on error", async () => {
    // simulate file cannot be opened
    spyOpen.mockRejectedValue(new Error("hi"));

    const result = await getApplicationState(unusedObject, settingsStore);

    expect(result).toBe(null);
  });
});
