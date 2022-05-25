import { Plugin } from "esbuild-wasm";

export const unpkgFilePlugin = (input: string): Plugin => {
  return {
    name: "unpkg-file-plugin",
    setup: (build) => {
      // "index.js" is not a "file", but the code cells
      // a special loader is set up for this path
      build.onResolve({ filter: /^index\.js$/ }, () => {
        return {
          path: "index.js",
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
      build.onLoad({ filter: /^index\.js$/, namespace: "u" }, () => {
        return {
          contents: input,
          loader: "jsx",
        };
      });

      build.onLoad({ filter: /\.css$/, namespace: "u" }, async (args) => {
        const result = await fetch(args.path);
        // "" strings in javascript are very sensitive to new lines and quotes
        // we must remove them first
        // however this is different from minifying the styles
        const text = (await result.text())
          .replace(/\n/g, "")
          .replace(/'/g, "\\'")
          // I could have used triple escapes here but this looks less confusing
          .replace(/"/g, '\\"');
        const injectedCSS = `
          const style = document.createElement("style");
          style.text = "${text}";
          document.head.appendChild(style);
        `;
        return {
          contents: injectedCSS,
          loader: "jsx",
          resolveDir: new URL(".", result.url).pathname,
        };
      });

      // all files other than index.js
      build.onLoad({ filter: /.*/, namespace: "u" }, async (args) => {
        // this will ask unpkg to give the file
        const result = await fetch(args.path);
        const text = await result.text();
        return {
          contents: text,
          loader: "jsx",
          // tell the relative paths where are you relative to
          resolveDir: new URL(".", result.url).pathname,
        };
      });
    },
  };
};
