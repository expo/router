import type { RouteNode } from "./Route";

async function recurseAndFlattenNodes<
  T,
  TProps,
  TProcess extends (node: T, props: any) => Promise<T[]>
>(nodes: T[], props: TProps, func: TProcess): Promise<T[]> {
  const tarr = await Promise.all(nodes.map((node) => func(node, props)).flat());
  return tarr.filter(Boolean) as T[];
}

export async function loadStaticParamsAsync(
  route: RouteNode
): Promise<RouteNode> {
  const processed = (
    await Promise.all(
      route.children.map((route) =>
        loadStaticParamsRecursive(route, { parentParams: {} })
      )
    )
  ).flat();

  route.children = processed;
  return route;
}

function assertStaticParams(route: RouteNode, params: any) {
  const matches = route.dynamic!.every((dynamic) => {
    const value = params[dynamic.name];
    return value !== undefined && value !== null;
  });
  if (!matches) {
    throw new Error(
      `generateStaticParams() must return an array of params that match the dynamic route. Received ${JSON.stringify(
        params
      )}`
    );
  }

  route.dynamic!.forEach((dynamic) => {
    const value = params[dynamic.name];
    if (dynamic.deep) {
      if (!Array.isArray(value)) {
        throw new Error(
          `generateStaticParams() for route "${route.contextKey}" expected param "${dynamic.name}" to be of type Array.`
        );
      }
    } else {
      if (Array.isArray(value)) {
        throw new Error(
          `generateStaticParams() for route "${route.contextKey}" expected param "${dynamic.name}" to not be of type Array.`
        );
      }
    }
    return value !== undefined && value !== null;
  });
}

/** lodash.uniqBy */
function uniqBy<T>(array: T[], key: (item: T) => string): T[] {
  const seen: { [key: string]: boolean } = {};
  return array.filter((item) => {
    const k = key(item);
    if (seen[k]) {
      return false;
    }
    seen[k] = true;
    return true;
  });
}

async function loadStaticParamsRecursive(
  route: RouteNode,
  props: { parentParams: any }
): Promise<RouteNode[]> {
  if (!route?.dynamic) {
    return [route];
  }

  const loaded = await route.loadRoute();
  if (!loaded.generateStaticParams) {
    return [route];
  }

  const staticParams = await loaded.generateStaticParams({
    params: props.parentParams || {},
  });

  if (!Array.isArray(staticParams)) {
    throw new Error(
      `generateStaticParams() must return an array of params, received ${staticParams}`
    );
  }

  // Assert that at least one param from each matches the dynamic route.
  staticParams.forEach((params) => assertStaticParams(route, params));

  console.log(
    "parse:",
    route.contextKey,
    route.route,
    props.parentParams,
    route.children
  );

  route.children = uniqBy(
    (
      await recurseAndFlattenNodes(
        [...route.children],
        {
          ...props,
          parentParams: {
            ...props.parentParams,
            ...staticParams,
          },
        },
        loadStaticParamsRecursive
      )
    ).flat(),
    (i) => i.route
  );

  const createParsedRouteName = (params: any) => {
    let parsedRouteName = route.route;
    route.dynamic?.map((query) => {
      const param = params[query.name];
      const formattedParameter = Array.isArray(param) ? param.join("/") : param;
      if (query.deep) {
        parsedRouteName = parsedRouteName.replace(
          `[...${query.name}]`,
          formattedParameter
        );
      } else {
        parsedRouteName = parsedRouteName.replace(`[${query.name}]`, param);
      }
    });

    return parsedRouteName;
  };

  const generatedRoutes = await Promise.all(
    staticParams.map(async (params) => {
      const parsedRoute = createParsedRouteName(params);

      return {
        ...route,
        // Convert the dynamic route to a static route.
        dynamic: null,
        route: parsedRoute,
        children: uniqBy(
          (
            await recurseAndFlattenNodes(
              [...route.children],
              {
                ...props,
                parentParams: {
                  ...props.parentParams,
                  ...staticParams,
                },
              },
              loadStaticParamsRecursive
            )
          ).flat(),
          (i) => i.route
        ),
      };
    })
  );

  return [route, ...generatedRoutes];
}
