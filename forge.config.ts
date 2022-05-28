import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import type { ForgeConfig } from "@electron-forge/shared-types";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig,
        // devContentSecurityPolicy:
        //   "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data: https://cdn.jsdelivr.net/; style-src https://cdn.jsdelivr.net/ 'unsafe-inline'; worker-src blob:; connect-src *; font-src https://cdn.jsdelivr.net/",
        devContentSecurityPolicy:
          "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; worker-src blob: 'self'; connect-src *;",
        renderer: {
          config: rendererConfig,
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.ts",
              name: "main_window",
              preload: {
                js: "./src/preload.ts",
              },
            },
          ],
        },
      },
    },
  ],
};

export default config;
