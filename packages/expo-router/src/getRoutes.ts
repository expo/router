import { DynamicConvention, RouteNode } from "./Route";
import {
  getNameFromFilePath,
  matchDeepDynamicRouteName,
  matchDynamicName,
  matchGroupName,
  removeSupportedExtensions,
  stripGroupSegmentsFromPath,
} from "./matchers";
import { RequireContext } from "./types";

export type FileNode = Pick<RouteNode, "contextKey" | "loadRoute"> & {
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

export function generateDynamicFromSegment(
  name: string
): DynamicConvention | null {
  const deepDynamicName = matchDeepDynamicRouteName(name);
  const dynamicName = deepDynamicName ?? matchDynamicName(name);

  return dynamicName ? { name: dynamicName, deep: !!deepDynamicName } : null;
}

export function generateDynamic(name: string): RouteNode["dynamic"] {
  const description = name
    .split("/")
    .map((segment) => generateDynamicFromSegment(segment))
    .filter(Boolean) as DynamicConvention[];
  return description.length === 0 ? null : description;
}

function collapseRouteSegments(route: string) {
  return stripGroupSegmentsFromPath(route.replace(/\/index$/, ""));
}

/**
 * Given a route node and a name representing the group name,
 * find the nearest child matching the name.
 *
 * Doesn't support slashes in the name.
 * Routes like `explore/(something)/index` will be matched against `explore`.
 *
 */
function getDefaultInitialRoute(node: RouteNode, name: string) {
  return node.children.find(
    (node) => collapseRouteSegments(node.route) === name
  );
}

function applyDefaultInitialRouteName(node: RouteNode): RouteNode {
  const groupName = matchGroupName(node.route);
  if (!node.children?.length) {
    return node;
  }

  // Guess at the initial route based on the group name.
  // TODO(EvanBacon): Perhaps we should attempt to warn when the group doesn't match any child routes.
  let initialRouteName = groupName
    ? getDefaultInitialRoute(node, groupName)?.route
    : undefined;
  const loaded = node.loadRoute();

  if (loaded.unstable_settings) {
    // Allow unstable_settings={ initialRouteName: '...' } to override the default initial route name.
    initialRouteName =
      loaded.unstable_settings.initialRouteName ?? initialRouteName;

    if (groupName) {
      // Allow unstable_settings={ 'custom': { initialRouteName: '...' } } to override the less specific initial route name.
      const groupSpecificInitialRouteName =
        loaded.unstable_settings?.[groupName]?.initialRouteName;

      initialRouteName = groupSpecificInitialRouteName ?? initialRouteName;
    }
  }

  return {
    ...node,
    initialRouteName,
  };
}

function cloneGroupRoute(
  node: RouteNode,
  { name: nextName }: { name: string }
): RouteNode {
  const groupName = `(${nextName})`;
  const parts = node.contextKey.split("/");
  parts[parts.length - 2] = groupName;

  return {
    ...node,
    route: groupName,
    contextKey: parts.join("/"),
  };
}

function treeNodeToRouteNode({
  name,
  node,
  children,
}: TreeNode): RouteNode[] | null {
  const dynamic = generateDynamic(name);

  if (node) {
    const groupName = matchGroupName(name);
    const multiGroup = groupName?.includes(",");

    const clones = multiGroup
      ? groupName!.split(",").map((v) => ({ name: v.trim() }))
      : null;

    // Assert duplicates:
    if (clones) {
      const names = new Set<string>();
      for (const clone of clones) {
        if (names.has(clone.name)) {
          throw new Error(
            `Array syntax cannot contain duplicate group name "${clone.name}" in "${node.contextKey}".`
          );
        }
        names.add(clone.name);
      }
    }

    const output = {
      loadRoute: node.loadRoute,
      route: name,
      contextKey: node.contextKey,
      children: getTreeNodesAsRouteNodes(children),
      dynamic,
    };

    if (Array.isArray(clones)) {
      return clones.map((clone) =>
        applyDefaultInitialRouteName(cloneGroupRoute({ ...output }, clone))
      );
    }

    return [
      applyDefaultInitialRouteName({
        loadRoute: node.loadRoute,
        route: name,
        contextKey: node.contextKey,
        children: getTreeNodesAsRouteNodes(children),
        dynamic,
      }),
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
      loadRoute: () => contextModule(key),
      normalizedName: getNameFromFilePath(key),
      contextKey: key,
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
    loadRoute: () => ({
      default: (
        require("./views/Navigator") as typeof import("./views/Navigator")
      ).DefaultNavigator,
    }),
    // Generate a fake file name for the directory
    contextKey: "./_layout.tsx",
    route: "",

    generated: true,
    dynamic: null,
    children: routes,
  };
}

/**
 * Asserts if the require.context has files that share the same name but have different extensions. Exposed for testing.
 * @private
 */
export function assertDuplicateRoutes(filenames: string[]) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const duplicates = filenames
    .map((filename) => removeSupportedExtensions(filename))
    .reduce((acc, filename) => {
      acc[filename] = acc[filename] ? acc[filename] + 1 : 1;
      return acc;
    }, {} as Record<string, number>);

  Object.entries(duplicates).forEach(([filename, count]) => {
    if (count > 1) {
      throw new Error(`Multiple files match the route name "${filename}".`);
    }
  });
}

/** Given a Metro context module, return an array of nested routes. */
export function getRoutes(contextModule: RequireContext): RouteNode | null {
  const route = getExactRoutes(contextModule);
  if (!route) {
    return null;
  }

  appendSitemapRoute(route);

  // Auto add not found route if it doesn't exist
  appendUnmatchedRoute(route);

  return route;
}

/** Get routes without unmatched or sitemap. */
export function getExactRoutes(
  contextModule: RequireContext
): RouteNode | null {
  assertDuplicateRoutes(contextModule.keys());
  const files = contextModuleToFileNodes(contextModule);
  const treeNodes = getRecursiveTree(files);
  const route = treeNodesToRootRoute(treeNodes);
  return route || null;
}

function appendSitemapRoute(routes: RouteNode) {
  if (
    !routes.children.length ||
    // Allow overriding the sitemap route
    routes.children.some((route) => route.route === "_sitemap")
  ) {
    return routes;
  }
  const { Sitemap, getNavOptions } = require("./views/Sitemap");
  routes.children.push({
    loadRoute() {
      return { default: Sitemap, getNavOptions };
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
      loadRoute() {
        return { default: require("./views/Unmatched").Unmatched };
      },
      route: "[...404]",
      contextKey: "./[...404].tsx",
      dynamic: [{ name: "404", deep: true }],
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
    // Recurse through group routes
    if (matchGroupName(route.route)) {
      const child = getUserDefinedDeepDynamicRoute(route);
      if (child) {
        return child;
      }
    }
  }
  return null;
}
