import { describe, expect, it } from "vitest";
import { breakdownFileName, getFileName } from "./fileNameUtils";

describe("file name utils works", () => {
  describe("getFileName()", () => {
    it("works for unix paths", () => {
      const path = "/home/whatever/Docs/hi.test.json";

      const actual = getFileName(path);
      const expected = "hi.test.json";
      expect(actual).toBe(expected);
    });

    it("works for windows paths", () => {
      const path = "C:\\\\Users\\John\\Files\\hi.test.json";

      const actual = getFileName(path);
      const expected = "hi.test.json";
      expect(actual).toBe(expected);
    });
  });

  describe("breakdownFileName()", () => {
    it("works for files names that have one dot only", () => {
      const name = "normal.json";

      const actual = breakdownFileName(name);
      const expected = { name: "normal", ext: "json" };

      expect(actual).toEqual(expected);
    });

    it("returns empty name or ext for empty names", () => {
      const name = "";

      const actual = breakdownFileName(name);
      const expected = { name: "", ext: "" };

      expect(actual).toEqual(expected);
    });

    it("works correctly for multiples dots", () => {
      const name = "normal.jsnote.json";

      const actual = breakdownFileName(name);
      const expected = { name: "normal", ext: "jsnote.json" };

      expect(actual).toEqual(expected);
    });
  });
});
