/* eslint-env jest */
import JsonFile from "@expo/json-file";
import execa from "execa";
import fs from "fs-extra";
import klawSync from "klaw-sync";
import path from "path";

import {
  projectRoot,
  setupTestProjectAsync,
  bin,
  ensurePortFreeAsync,
  ensureTesterReadyAsync,
} from "./utils";

const originalForceColor = process.env.FORCE_COLOR;
const originalCI = process.env.CI;

beforeAll(async () => {
  await fs.mkdir(projectRoot, { recursive: true });
  process.env.FORCE_COLOR = "0";
  process.env.CI = "1";
  process.env.EXPO_USE_PATH_ALIASES = "1";
  delete process.env.EXPO_USE_STATIC;
});

afterAll(() => {
  process.env.FORCE_COLOR = originalForceColor;
  process.env.CI = originalCI;
  delete process.env.EXPO_USE_PATH_ALIASES;
});

beforeEach(() => ensurePortFreeAsync(19000));
it(
  "runs `npx expo export -p web` for static rendering",
  async () => {
    const projectRoot = await ensureTesterReadyAsync("custom-html");

    await execa("npx", [bin, "export", "-p", "web"], {
      cwd: projectRoot,
      env: {
        EXPO_USE_STATIC: "1",
      },
    });

    const outputDir = path.join(projectRoot, "dist");
    // List output files with sizes for snapshotting.
    // This is to make sure that any changes to the output are intentional.
    // Posix path formatting is used to make paths the same across OSes.
    const files = klawSync(outputDir)
      .map((entry) => {
        if (entry.path.includes("node_modules") || !entry.stats.isFile()) {
          return null;
        }
        return path.posix.relative(outputDir, entry.path);
      })
      .filter(Boolean);

    const metadata = await JsonFile.readAsync(
      path.resolve(outputDir, "metadata.json")
    );

    expect(metadata).toEqual({
      bundler: "metro",
      fileMetadata: {
        web: {
          assets: expect.anything(),
          bundle: expect.stringMatching(/bundles\/web-.*\.js/),
        },
      },
      version: 0,
    });

    // If this changes then everything else probably changed as well.
    expect(files).toEqual([
      // TODO: No +html.html
      "+html.html",
      "[...404].html",
      "_sitemap.html",
      "about.html",
      "assets/35ba0eaec5a4f5ed12ca16fabeae451d",
      "assets/369745d4a4a6fa62fa0ed495f89aa964",
      "assets/4f355ba1efca4b9c0e7a6271af047f61",
      "assets/5223c8d9b0d08b82a5670fb5f71faf78",
      "assets/52dec48a970c0a4eed4119cd1252ab09",
      "assets/5b50965d3dfbc518fe50ce36c314a6ec",
      "assets/817aca47ff3cea63020753d336e628a4",
      "assets/b2de8e638d92e0f719fa92fa4085e02a",
      "assets/cbbeac683d803ac27cefb817787d2bfa",
      "assets/e62addcde857ebdb7342e6b9f1095e97",
      expect.stringMatching(/bundles\/web-.*\.js/),
      "favicon.ico",
      "index.html",
      "metadata.json",
    ]);

    const about = await fs.readFile(path.join(outputDir, "about.html"), "utf8");

    // Route-specific head tags
    expect(about).toContain(`<title data-rh="true">About | Website</title>`);

    // Nested head tags from layout route
    expect(about).toContain('<meta data-rh="true" name="fake" content="bar"/>');

    // Root element
    expect(about).toContain('<div id="root">');
    // Content of the page
    expect(about).toContain('data-testid="content">About</div>');

    // <script src="/bundles/web-c91ecb663cfce9b9e90e28d253e72e0a.js" defer>
    const sanitizedAbout = about.replace(
      /<script src="\/bundles\/.*" defer>/g,
      '<script src="/bundles/[mock].js" defer>'
    );
    expect(sanitizedAbout).toMatchSnapshot();
  },
  // Could take 45s depending on how fast npm installs
  240 * 1000
);
