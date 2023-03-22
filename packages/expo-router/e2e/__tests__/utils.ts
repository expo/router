/* eslint-env jest */
import { ExpoConfig, getConfig, PackageJSONConfig } from "@expo/config";
import JsonFile from "@expo/json-file";
import { SpawnOptions, SpawnResult } from "@expo/spawn-async";
import assert from "assert";
import execa from "execa";
import findProcess from "find-process";
import fs from "fs-extra";
import os from "os";
import path from "path";
import treeKill from "tree-kill";
import { sync as globSync } from "glob";
import { promisify } from "util";

export const bin = "expo-internal"; //require.resolve("../../build/bin/cli");

export const projectRoot = getTemporaryPath();

export function getTemporaryPath() {
  return path.join(os.tmpdir(), Math.random().toString(36).substring(2));
}

export function execute(...args: string[]) {
  return execa("npx", [bin, ...args], { cwd: projectRoot });
}

export function getRoot(...args: string[]) {
  return path.join(projectRoot, ...args);
}

const expoRouterFolder = path.join(__dirname, "../../");

function getLatestPackPath() {
  const results = globSync(`*.tgz`, {
    absolute: true,
    cwd: expoRouterFolder,
  });

  return results[0];
}

async function ensureLatestPackPathAsync() {
  let templatePath = getLatestPackPath();
  if (templatePath) return templatePath;
  await execa("npm", ["pack"], { cwd: expoRouterFolder });

  templatePath = getLatestPackPath();
  if (templatePath) return templatePath;

  throw new Error("Could not find expo-router tarball");
}

export async function abortingSpawnAsync(
  cmd: string,
  args: string[],
  options?: SpawnOptions
): Promise<SpawnResult> {
  const spawnAsync = jest.requireActual(
    "@expo/spawn-async"
  ) as typeof import("@expo/spawn-async");

  const promise = spawnAsync(cmd, args, options);
  promise.child.stdout?.pipe(process.stdout);
  promise.child.stderr?.pipe(process.stderr);

  // TODO: Not sure how to do this yet...
  // const unsub = addJestInterruptedListener(() => {
  //   promise.child.kill('SIGINT');
  // });
  try {
    return await promise;
  } catch (e) {
    const error = e as Error;
    if (isSpawnResult(error)) {
      const spawnError = error as SpawnResult;
      if (spawnError.stdout)
        error.message += `\n------\nSTDOUT:\n${spawnError.stdout}`;
      if (spawnError.stderr)
        error.message += `\n------\nSTDERR:\n${spawnError.stderr}`;
    }
    throw error;
  } finally {
    // unsub();
  }
}

function isSpawnResult(
  errorOrResult: Error
): errorOrResult is Error & SpawnResult {
  return (
    "pid" in errorOrResult &&
    "stdout" in errorOrResult &&
    "stderr" in errorOrResult
  );
}

const latestCliPackPath = path.join(__dirname, "../expo-cli-0.6.1.tgz");

export async function installAsync(projectRoot: string, pkgs: string[] = []) {
  return abortingSpawnAsync("yarn", pkgs, {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

/**
 * @param parentDir Directory to create the project folder in, i.e. os temp directory
 * @param props.dirName Name of the project folder, used to prevent recreating the project locally
 * @param props.reuseExisting Should reuse the existing project if possible, good for testing locally
 * @param props.fixtureName Name of the fixture folder to use, this must map to the directories in the `expo/e2e/fixtures/` folder
 * @param props.config Optional extra values to add inside the app.json `expo` object
 * @param props.pkg Optional extra values to add to the fixture package.json file before installing
 * @returns The project root that can be tested inside of
 */
export async function createFromFixtureAsync(
  parentDir: string,
  {
    dirName,
    reuseExisting,
    fixtureName,
    config,
    pkg,
  }: {
    dirName: string;
    reuseExisting?: boolean;
    fixtureName: string;
    config?: Partial<ExpoConfig>;
    pkg?: Partial<PackageJSONConfig>;
  }
): Promise<string> {
  const projectRoot = path.join(parentDir, dirName);

  if (fs.existsSync(projectRoot)) {
    if (reuseExisting) {
      console.log("[setup] Reusing existing fixture project:", projectRoot);
      // bail out early, this is good for local testing.
      return projectRoot;
    } else {
      console.log("[setup] Clearing existing fixture project:", projectRoot);
      await fs.promises.rm(projectRoot, { recursive: true, force: true });
    }
  }

  try {
    const fixturePath = path.join(__dirname, "../fixtures", fixtureName);

    if (!fs.existsSync(fixturePath)) {
      throw new Error("No fixture project named: " + fixtureName);
    }

    // Create the project root
    fs.mkdirSync(projectRoot, { recursive: true });
    console.log("[setup] Created fixture project:", projectRoot);

    // Copy all files recursively into the temporary directory
    await fs.copy(fixturePath, projectRoot);

    // Add additional modifications to the package.json
    if (pkg) {
      const pkgPath = path.join(projectRoot, "package.json");
      const fixturePkg = (await JsonFile.readAsync(
        pkgPath
      )) as PackageJSONConfig;

      await JsonFile.writeAsync(pkgPath, {
        ...pkg,
        ...fixturePkg,
        dependencies: {
          ...(fixturePkg.dependencies || {}),
          ...(pkg.dependencies || {}),
        },
        devDependencies: {
          ...(fixturePkg.devDependencies || {}),
          ...(pkg.devDependencies || {}),
        },
        scripts: {
          ...(fixturePkg.scripts || {}),
          ...(pkg.scripts || {}),
        },
      });
    }

    // Add additional modifications to the Expo config
    if (config) {
      const { rootConfig, staticConfigPath } = getConfig(projectRoot, {
        // pkgs not installed yet
        skipSDKVersionRequirement: true,
        skipPlugins: true,
      });

      const modifiedConfig = {
        ...rootConfig,
        expo: {
          ...(rootConfig.expo || {}),
          ...config,
        },
      };
      assert(staticConfigPath);
      await JsonFile.writeAsync(staticConfigPath, modifiedConfig as any);
    }

    // Install the packages for e2e experience.
    await installAsync(projectRoot);
  } catch (error) {
    // clean up if something failed.
    // await fs.remove(projectRoot).catch(() => null);
    throw error;
  }

  await execa("yarn", ["link"], { cwd: expoRouterFolder });
  await execa("yarn", ["link", "expo-router"], { cwd: projectRoot });
  await execa("yarn", ["install", "--force"], { cwd: projectRoot });

  // await execa(
  //   "yarn",
  //   ["add", await ensureLatestPackPathAsync(), latestCliPackPath],
  //   {
  //     cwd: projectRoot,
  //   }
  // );

  return projectRoot;
}

// Set this to true to enable caching and prevent rerunning yarn installs
const testingLocally = false; //!process.env.CI;

export async function ensureTesterReadyAsync(
  fixtureName: string
): Promise<string> {
  const root = path.join(__dirname, "../../../apps/tester");

  // Clear metro cache for the env var to be updated
  await fs.remove(path.join(root, "node_modules/.cache/metro"));

  process.env.E2E_ROUTER_SRC = fixtureName;

  await execa("yarn", { cwd: root });

  await execa("yarn", ["add", latestCliPackPath], {
    cwd: root,
  });

  // // If you're testing this locally, you can set the projectRoot to a local project (you created with expo init) to save time.
  // const projectRoot = await createFromFixtureAsync(os.tmpdir(), {
  //   dirName: name,
  //   reuseExisting: testingLocally,
  //   fixtureName,
  // });

  // // Many of the factors in this test are based on the expected SDK version that we're testing against.
  // const { exp } = getConfig(projectRoot, { skipPlugins: true });
  // expect(exp.sdkVersion).toBe(sdkVersion);
  return root;
}

export async function setupTestProjectAsync(
  name: string,
  fixtureName: string,
  sdkVersion: string = "48.0.0"
): Promise<string> {
  // If you're testing this locally, you can set the projectRoot to a local project (you created with expo init) to save time.
  const projectRoot = await createFromFixtureAsync(os.tmpdir(), {
    dirName: name,
    reuseExisting: testingLocally,
    fixtureName,
  });

  // Many of the factors in this test are based on the expected SDK version that we're testing against.
  const { exp } = getConfig(projectRoot, { skipPlugins: true });
  expect(exp.sdkVersion).toBe(sdkVersion);
  return projectRoot;
}

/** Returns a list of loaded modules relative to the repo root. Useful for preventing lazy loading from breaking unexpectedly.   */
export async function getLoadedModulesAsync(
  statement: string
): Promise<string[]> {
  const repoRoot = path.join(__dirname, "../../../../");
  const results = await execa(
    "node",
    [
      "-e",
      [
        statement,
        `console.log(JSON.stringify(Object.keys(require('module')._cache)));`,
      ].join("\n"),
    ],
    { cwd: __dirname }
  );
  const loadedModules = JSON.parse(results.stdout.trim());
  return loadedModules
    .map((value: string) => path.relative(repoRoot, value))
    .sort();
}

const pTreeKill = promisify(treeKill);

export async function ensurePortFreeAsync(port: number) {
  const [portProcess] = await findProcess("port", port);
  if (!portProcess) {
    return;
  }
  console.log(`Killing process ${portProcess.name} on port ${port}...`);
  try {
    await pTreeKill(portProcess.pid);
    console.log(`Killed process ${portProcess.name} on port ${port}`);
  } catch (error: any) {
    console.log(
      `Failed to kill process ${portProcess.name} on port ${port}: ${error.message}`
    );
  }
}
