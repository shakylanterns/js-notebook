import esbuild from "esbuild-wasm";

let initialized = false;

export async function initEsbuild() {
  if (initialized) {
    return;
  }
  await esbuild.initialize({
    wasmURL: "https://unpkg.com/esbuild-wasm@0.16.10/esbuild.wasm",
    worker: true,
  });
  initialized = true;
}

export async function getEsbuild() {
  if (!initialized) {
    await initEsbuild();
  }
  return esbuild;
}
