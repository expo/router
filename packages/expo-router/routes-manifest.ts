import { getMatchableRouteConfigs } from "expo-router/src/fork/getStateFromPath";
import { getReactNavigationConfig } from "expo-router/src/getReactNavigationConfig";
import { getRoutes } from "expo-router/src/getRoutes";

import { ctx } from "expo-router/_root";

type RoutesManifest = {
  regex: string;
  // original file path
  src: string;
}[];

export function createRoutesManifest(files: string[]): RoutesManifest | null {
  const routeTree = getRoutes(ctx, {
    //   const routeTree = getRoutes(createMockContextModule(files), {
    preserveApiRoutes: true,
  });
  //   console.log('tree:', process.env)

  if (!routeTree) {
    return null;
  }

  const config = getReactNavigationConfig(routeTree, false);

  const { configs } = getMatchableRouteConfigs(config);

  const manifest: RoutesManifest = configs.map((config) => {
    const isApi = config._route!.contextKey?.match(/\+api\.[tj]sx?/);

    const src = config
      ._route!.contextKey.replace(/\.[tj]sx?$/, ".js")
      .replace(/^\.\//, "");

    return {
      dynamic: config._route!.dynamic,
      generated: config._route!.generated,
      type: isApi ? "dynamic" : "static",
      file: config._route!.contextKey,
      regex: config.regex?.source ?? /^\/$/.source,
      src: isApi ? "./.expo/functions/" + src : "./" + src,
    };
  });

  return manifest;
}
