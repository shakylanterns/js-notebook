import { OnLoadResult, Plugin } from "esbuild-wasm";
import { get, set } from "idb-keyval";
import { Languages } from "../events/ipcTypes";

export const unpkgFilePlugin = (input: string, language: Languages): Plugin => {
  const loader = language === "javascript" ? "jsx" : "tsx";
  return {
    name: "unpkg-file-plugin",
    setup: (build) => {
      // "index.js" is not a "file", but the code cells
      // a special loader is set up for this path
      build.onResolve({ filter: /^index\.(j|t)s$/ }, (args) => {
        return {
          path: args.path,
          namespace: "u",
        };
      });

      // for the relative paths inside a package
      // e.g. "src/utils/usefulFunction.js" in package "star"
      // is https://unpkg.com/star@<version>/src/utils/usefulFunction.js
      // args.path will be ./utils/usefulFunction.js
      // and args.resolveDir will be /star@<version>/src
      // that means, all files are relative to the main file of a package
      build.onResolve({ filter: /^.+\// }, (args) => {
        return {
          // the final slash is needed, or else the URL constructor will strip everything after the domain
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
          namespace: "u",
        };
      });

      // the catch-all case, this handles the package base and css files
      // all the files inside a package are resolved in the last handler
      build.onResolve({ filter: /.*/ }, (args) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "u",
        };
      });

      // here we just return what the user has typed in the cell
      build.onLoad({ filter: /^index\.(j|t)s$/, namespace: "u" }, () => {
        return {
          contents: input,
          loader,
        };
      });

      build.onLoad({ filter: /\.css$/, namespace: "u" }, async (args) => {
        const cached = await get<OnLoadResult>(args.path);
        if (cached) {
          return cached;
        }

        const result = await fetch(args.path);
        const text = (await result.text())
          .replace(/\n/g, "")
          .replace(/'/g, "\\'")
          // I could have used triple escapes here but this looks less confusing
          .replace(/"/g, '\\"');

        // "" strings in javascript are very sensitive to new lines and quotes
        // we must remove them first
        // however this is different from minifying the styles
        const injectedCSS = `
          const style = document.createElement("style");
          style.text = "${text}";
          document.head.appendChild(style);
        `;
        const toBeCached: OnLoadResult = {
          contents: injectedCSS,
          loader,
          resolveDir: new URL(".", result.url).pathname,
        };

        await set(args.path, toBeCached);
        return toBeCached;
      });

      // all files other than index.js
      build.onLoad({ filter: /.*/, namespace: "u" }, async (args) => {
        const cached = await get<OnLoadResult>(args.path);
        if (cached) {
          return cached;
        }
        // this will ask unpkg to give the file
        const result = await fetch(args.path);
        const text = await result.text();
        const toBeCached: OnLoadResult = {
          contents: text,
          loader,
          // tell the relative paths where are you relative to
          resolveDir: new URL(".", result.url).pathname,
        };
        await set(args.path, toBeCached);
        return toBeCached;
      });
    },
  };
};
