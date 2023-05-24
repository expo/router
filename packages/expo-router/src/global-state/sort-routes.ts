import { RouteNode } from "../Route";
import { matchGroupName } from "../matchers";
import type { RouterStore } from "./router-store";

export function getSortedRoutes(this: RouterStore) {
  if (!this.routeNode) {
    throw new Error("No routes found");
  }

  return this.routeNode.children
    .filter((route) => !route.internal)
    .sort((a: RouteNode, b: RouteNode): number => {
      if (a.dynamic && !b.dynamic) {
        return 1;
      }
      if (!a.dynamic && b.dynamic) {
        return -1;
      }
      if (a.dynamic && b.dynamic) {
        if (a.dynamic.length !== b.dynamic.length) {
          return b.dynamic.length - a.dynamic.length;
        }
        for (let i = 0; i < a.dynamic.length; i++) {
          const aDynamic = a.dynamic[i];
          const bDynamic = b.dynamic[i];
          if (aDynamic.deep && !bDynamic.deep) {
            return 1;
          }
          if (!aDynamic.deep && bDynamic.deep) {
            return -1;
          }
        }
        return 0;
      }

      const aIndex = a.route === "index" || matchGroupName(a.route) != null;
      const bIndex = b.route === "index" || matchGroupName(b.route) != null;

      if (aIndex && !bIndex) {
        return -1;
      }
      if (!aIndex && bIndex) {
        return 1;
      }

      return a.route.length - b.route.length;
    });
}
