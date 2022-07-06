import { describe, expect, it } from "vitest";
import { ApplicationSettings } from "../../events/ipcTypes";
import { store } from "../store";
import { selectAppSettings, setSettings } from "./app";

describe("app reducer works", () => {
  it("set settings", () => {
    const settings: ApplicationSettings = { defaultLanguage: "typescript" };
    store.dispatch(setSettings(settings));
    expect(selectAppSettings(store.getState())).toEqual(settings);
  });
});
