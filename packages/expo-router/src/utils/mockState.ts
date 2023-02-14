import { getNavigationConfig } from "../getLinkingConfig";
import { getRoutes } from "../getRoutes";
import { RequireContext } from "../types";

export function createMockContextModule(
  map: Record<string, Record<string, any>> = {}
) {
  const contextModule = jest.fn((key) => map[key]);

  Object.defineProperty(contextModule, "keys", {
    value: () => Object.keys(map),
  });

  return contextModule as unknown as RequireContext;
}

export function configFromFs(map: (string | [string, object])[] = []) {
  const ctx = map.reduce((acc, value: any) => {
    if (typeof value === "string") {
      acc[value] = { default: () => {} };
      return acc;
    }
    acc[value[0]] = value[1];
    return acc;
  }, {} as Record<string, Record<string, any>>);

  return getNavigationConfig(getRoutes(createMockContextModule(ctx))!);
}
