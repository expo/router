import { RouteNode } from "./Route";
import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchFragmentName,
} from "./matchers";
import { RequireContext } from "./types";
import { DefaultLayout } from "./views/Layout";

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
  return nodes.map(treeNodeToRouteNode).flat().filter(Boolean) as RouteNode[];
}

export function generateDynamic(name: string) {
  const deepDynamicName = matchDeepDynamicRouteName(name);
  const dynamicName = deepDynamicName ?? matchDynamicName(name);

  return dynamicName ? { name: dynamicName, deep: !!deepDynamicName } : null;
}

function treeNodeToRouteNode({
  name,
  node,
  children,
}: TreeNode): RouteNode[] | null {
  const dynamic = generateDynamic(name);

  if (node) {
    return [
      {
        route: name,
        getExtras: node.getExtras,
        getComponent: node.getComponent,
        contextKey: node.contextKey,
        children: getTreeNodesAsRouteNodes(children),
        dynamic,
      },
    ];
  }

  // Empty folder, skip it.
  if (!children.length) {
    return null;
  }

  // When there's a directory, but no layout route file (with valid export), the child routes won't be grouped.
  // This pushes all children into the nearest layout route.
  return getTreeNodesAsRouteNodes(
    children.map((child) => {
      return {
        ...child,
        name: [name, child.name].filter(Boolean).join("/"),
      };
    })
  );
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

function hasCustomRootLayoutNode(routes: RouteNode[]) {
  if (routes.length !== 1) {
    return false;
  }
  // This could either be the root _layout or an app with a single file.
  const route = routes[0];

  if (
    route.route === "" &&
    route.contextKey.match(/^\.\/_layout\.([jt]sx?)$/)
  ) {
    return true;
  }
  return false;
}

function treeNodesToRootRoute(treeNode: TreeNode): RouteNode | null {
  const routes = treeNodeToRouteNode(treeNode);

  if (!routes?.length) {
    return null;
  }

  if (hasCustomRootLayoutNode(routes)) {
    return routes[0];
  }

  return {
    // Generate a fake file name for the directory
    contextKey: "./_layout.tsx",
    route: "",
    generated: true,
    dynamic: null,
    getExtras: () => ({}),
    getComponent: () => DefaultLayout,
    children: routes,
  };
}

/** Given a Metro context module, return an array of nested routes. */
export function getRoutes(contextModule: RequireContext): RouteNode | null {
  const files = contextModuleToFileNodes(contextModule);
  const treeNodes = getRecursiveTree(files);
  const route = treeNodesToRootRoute(treeNodes);

  if (!route) {
    return null;
  }

  appendSitemapRoute(route);

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(route);

  return route;
}

function appendSitemapRoute(routes: RouteNode) {
  if (
    !routes.children.length ||
    // Allow overriding the sitemap route
    routes.children.some((route) => route.route === "_sitemap")
  ) {
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
    route: "_sitemap",
    contextKey: "./_sitemap.tsx",
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
