import { RouteNode } from "./Route";
import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { RequireContext } from "./types";

type FileNode = Pick<RouteNode, "contextKey" | "getComponent" | "getExtras"> & {
  /** Like `(tab)/index` */
  normalizedName: string;
};

type TreeNode = {
  name: string;
  children: TreeNode[];
  parents: string[];
  /** null when there is no file in a folder. */
  node: FileNode | null;
};

/** Convert a flat map of file nodes into a nested tree of files. */
function getRecursiveTree(files: FileNode[]): TreeNode {
  const tree = {
    name: "",
    children: [],
    parents: [],
    node: null,
  };

  for (const file of files) {
    // ['(tab)', 'settings', '[...another]']
    const parts = file.normalizedName.split("/");
    let currentNode: TreeNode = tree;
    for (const part of parts) {
      const existing = currentNode.children.find((item) => item.name === part);
      if (existing) {
        currentNode = existing;
      } else {
        const newNode: TreeNode = {
          name: part,
          children: [],
          parents: [...currentNode.parents, currentNode.name],
          node: null,
        };
        currentNode.children.push(newNode);
        currentNode = newNode;
      }
    }
    currentNode.node = file;
  }

  return tree;
}

function getTreeNodesAsRouteNodes(nodes: TreeNode[]): RouteNode[] {
  return nodes.map(treeNodeToRouteNode).filter(Boolean) as RouteNode[];
}

export function generateDynamic(name: string) {
  const deepDynamicName = matchDeepDynamicRouteName(name);
  const dynamicName = deepDynamicName ?? matchDynamicName(name);

  return dynamicName ? { name: dynamicName, deep: !!deepDynamicName } : null;
}

function Organization({ children }) {
  return children;
}

function treeNodeToRouteNode({
  name,
  node,
  parents,
  children,
}: TreeNode): RouteNode | null {
  const dynamic = generateDynamic(name);

  if (node) {
    return {
      route: name,
      getExtras: node.getExtras,
      getComponent: node.getComponent,
      contextKey: node.contextKey,
      children: getTreeNodesAsRouteNodes(children),
      dynamic,
    };
  }

  // Empty folder, skip it.
  if (!children.length) {
    return null;
  }

  // When there's a directory, but no sibling file with the same name, the directory won't work.
  // This ensures that we have a file for every directory (containing valid children).
  return {
    route: name,
    generated: true,
    getExtras: () => ({}),
    getComponent: () => Organization,
    // Generate a fake file name for the directory
    contextKey: [".", ...parents, name + ".tsx"].filter(Boolean).join("/"),
    children: getTreeNodesAsRouteNodes(children),
    dynamic,
  };
}

function contextModuleToFileNodes(contextModule: RequireContext): FileNode[] {
  const nodes = contextModule.keys().map((key) => {
    // In development, check if the file exports a default component
    // this helps keep things snappy when creating files. In production we load all screens lazily.
    try {
      if (!contextModule(key)?.default) {
        return null;
      }
    } catch (error) {
      // Probably this won't stop metro from freaking out but it's worth a try.
      console.warn('Error loading route "' + key + '"', error);
      return null;
    }

    const node: FileNode = {
      normalizedName: getNameFromFilePath(key),
      getComponent() {
        return contextModule(key).default;
      },
      contextKey: key,
      getExtras() {
        const { default: mod, ...extras } = contextModule(key);
        return extras;
      },
    };

    return node;
  });

  return nodes.filter(Boolean) as FileNode[];
}

/** Given a Metro context module, return an array of nested routes. */
export function getRoutes(contextModule: RequireContext): RouteNode[] {
  const files = contextModuleToFileNodes(contextModule);
  const treeNodes = getRecursiveTree(files).children;
  const routes = getTreeNodesAsRouteNodes(treeNodes);

  if (process.env.NODE_ENV !== "production") {
    appendDirectoryRoute(routes);
  }

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(routes);

  return routes;
}

function appendDirectoryRoute(routes: RouteNode[]) {
  if (!routes.length) {
    return routes;
  }
  const { Directory, getNavOptions } = require("./views/Directory");
  routes.push({
    getComponent() {
      return Directory;
    },
    getExtras() {
      return { getNavOptions };
    },
    route: "__index",
    contextKey: "./__index.tsx",
    generated: true,
    dynamic: null,
    children: [],
    internal: true,
  });
  return routes;
}

function appendUnmatchedRoute(routes: RouteNode[]) {
  // Auto add not found route if it doesn't exist
  const userDefinedDynamicRoute = getUserDefinedDeepDynamicRoute(routes);
  if (!userDefinedDynamicRoute) {
    routes.push({
      getComponent() {
        return require("./views/Unmatched").Unmatched;
      },
      getExtras() {
        return {};
      },
      route: "[...404]",
      contextKey: "./[...404].tsx",
      dynamic: { name: "404", deep: true },
      children: [],
      generated: true,
      internal: true,
    });
  }
  return routes;
}

/**
 * Exposed for testing.
 * @returns a top-level deep dynamic route if it exists, otherwise null.
 */
export function getUserDefinedDeepDynamicRoute(
  routes: RouteNode[]
): RouteNode | null {
  // Auto add not found route if it doesn't exist
  for (const route of routes) {
    const isDeepDynamic = matchDeepDynamicRouteName(route.route);
    if (isDeepDynamic) {
      return route;
    }
    // Recurse through fragment routes
    if (matchFragmentName(route.route)) {
      const child = getUserDefinedDeepDynamicRoute(route.children);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
