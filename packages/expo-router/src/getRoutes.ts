import { RouteNode } from "./Route";
import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { RequireContext } from "./types";

export type FileNode = Pick<
  RouteNode,
  "contextKey" | "getComponent" | "getExtras"
> & {
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
export function getRecursiveTree(files: FileNode[]): TreeNode {
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
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1 && part === "_layout") {
        if (currentNode.node) {
          const overwritten = currentNode.node.contextKey;
          throw new Error(
            `Higher priority Layout Route "${file.contextKey}" overriding redundant Layout Route "${overwritten}". Remove the Layout Route "${overwritten}" to fix this.`
          );
        }
        continue;
      }

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

  if (process.env.NODE_ENV !== "production") {
    assertDeprecatedFormat(tree);
  }

  return tree;
}

function assertDeprecatedFormat(tree: TreeNode) {
  for (const child of tree.children) {
    if (
      child.node &&
      child.children.length &&
      !child.node.normalizedName.endsWith("_layout")
    ) {
      const ext = child.node.contextKey.split(".").pop();
      throw new Error(
        `Using deprecated Layout Route format: Move \`./app/${child.node.normalizedName}.${ext}\` to \`./app/${child.node.normalizedName}/_layout.${ext}\``
      );
    }
    assertDeprecatedFormat(child);
  }
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
    contextKey: [".", ...parents, name, "_layout.tsx"]
      .filter(Boolean)
      .join("/"),
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
export function getRoutes(contextModule: RequireContext): RouteNode | null {
  const files = contextModuleToFileNodes(contextModule);
  const treeNodes = getRecursiveTree(files);
  const route = treeNodeToRouteNode(treeNodes);

  if (!route) {
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    appendDirectoryRoute(route);
  }

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(route);

  return route;
}

function appendDirectoryRoute(routes: RouteNode) {
  if (!routes.children.length) {
    return routes;
  }
  const { Directory, getNavOptions } = require("./views/Directory");
  routes.children.push({
    getComponent() {
      return Directory;
    },
    getExtras() {
      return { getNavOptions };
    },
    route: "__index",
    contextKey: "./__index.tsx",
    generated: true,
    internal: true,
    dynamic: null,
    children: [],
  });
  return routes;
}

function appendUnmatchedRoute(routes: RouteNode) {
  // Auto add not found route if it doesn't exist
  const userDefinedDynamicRoute = getUserDefinedDeepDynamicRoute(routes);
  if (!userDefinedDynamicRoute) {
    routes.children.push({
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
  routes: RouteNode
): RouteNode | null {
  // Auto add not found route if it doesn't exist
  for (const route of routes.children ?? []) {
    const isDeepDynamic = matchDeepDynamicRouteName(route.route);
    if (isDeepDynamic) {
      return route;
    }
    // Recurse through fragment routes
    if (matchFragmentName(route.route)) {
      const child = getUserDefinedDeepDynamicRoute(route);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
