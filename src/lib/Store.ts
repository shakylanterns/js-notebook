import { app } from "electron";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export class Store<T> {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async save(data: T) {
    const json = JSON.stringify(data, null, 2);
    await writeFile(this.getPath(), json);
  }

  async open() {
    const data = await readFile(this.getPath());
    return JSON.parse(data.toString());
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getPath() {
    return path.resolve(app.getPath("userData"), this.name + ".json");
  }
}
