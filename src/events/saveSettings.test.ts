import { Store } from "../lib/Store";
import { ApplicationSettings } from "./ipcTypes";
import { saveSettings } from "./saveSettings";

describe("save settings works", () => {
  // this object is not used in this handler
  const unusedObject = {} as unknown as Electron.IpcMainInvokeEvent;
  const settingsStore = new Store<ApplicationSettings>("app");
  const spySave = jest.spyOn(settingsStore, "save");

  it("returns empty string if file is written", async () => {
    // simulate correct read file
    const settings: ApplicationSettings = { defaultLanguage: "javascript" };
    spySave.mockResolvedValue();
    const result = await saveSettings(unusedObject, settings, settingsStore);

    expect(spySave).toBeCalledWith(settings);
    expect(result).toBe(true);
  });

  it("returns empty content and non empty error message when file not found", async () => {
    // simulate file not found
    const settings: ApplicationSettings = { defaultLanguage: "javascript" };
    spySave.mockRejectedValue(new Error(""));
    const result = await saveSettings(unusedObject, settings, settingsStore);

    expect(result).toBe(false);
  });
});
