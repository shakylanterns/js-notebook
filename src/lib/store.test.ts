import { readFile, writeFile } from "fs/promises";
import { describe, expect, it, vi } from "vitest";
import { Store } from "./Store";

vi.mock("fs/promises", () => {
  return {
    writeFile: vi.fn(),
    readFile: vi.fn(),
  };
});

const EXAMPLE_STORAGE_PATH = "/home/testing/.config/js-notebook";

vi.mock("electron", () => {
  return {
    app: {
      getPath() {
        return EXAMPLE_STORAGE_PATH;
      },
    },
  };
});

describe("store class", () => {
  it("returns the correct name when initialized or changed", () => {
    const store = new Store<Record<string, never>>("hello");
    expect(store.getName()).toBe("hello");
    store.setName("world");
    expect(store.getName()).toBe("world");
  });

  it("calls writeFile with the correct arguments", () => {
    const store = new Store<{ dummy: string }>("dum");
    const data = { dummy: "hi" };

    store.save(data);

    const serialized = JSON.stringify(data, null, 2);
    expect(writeFile).toBeCalledWith(
      EXAMPLE_STORAGE_PATH + "/dum.json",
      serialized
    );
  });

  it("throws error if the arguments passed to save is invalid", async () => {
    const store = new Store<{ dummy: object }>("dum");
    const data = { dummy: {} };
    data.dummy = data;

    await expect(store.save(data)).rejects.toThrow();
  });

  it("reads the correct file", () => {
    const dummy = Buffer.from("{}");
    vi.mocked(readFile).mockResolvedValue(dummy);

    const store = new Store<{ dummy: string }>("dum");
    store.open();

    expect(readFile).toBeCalledWith(EXAMPLE_STORAGE_PATH + "/dum.json");
  });

  it("reads correctly if the file has correct syntax", async () => {
    const correctData = Buffer.from(`
    {
      "defaultLanguage": "typescript"
    } 
    `);
    vi.mocked(readFile).mockResolvedValue(correctData);

    const store = new Store<{ defaultLanguage: string }>("dum");
    const result = await store.open();
    const expected = {
      defaultLanguage: "typescript",
    };
    expect(result).toEqual(expected);
  });

  it("throws error if the file has incorrect syntax", async () => {
    const incorrectData = Buffer.from(`
    {
      defaultLanguage: "typescript"
    } 
    `);
    vi.mocked(readFile).mockResolvedValue(incorrectData);

    const store = new Store<{ defaultLanguage: string }>("dum");
    await expect(store.open()).rejects.toThrow();
  });
});
