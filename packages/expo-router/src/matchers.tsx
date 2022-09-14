/** Match `[page]` -> `page` */
export function matchDynamicName(name: string): string | undefined {
    // Don't match `...` or `[` or `]` inside the brackets
    return name.match(/^\[([^/\[\](?:\.\.\.)]+)\]$/)?.[1];
}

/** Match `[...page]` -> `page` */
export function matchCatchAllRouteName(name: string): string | undefined {
    return name.match(/^\[\.\.\.([^/]+)\]$/)?.[1];
}

/** Match `[[...page]]` -> `page` */
export function matchOptionalCatchAllRouteName(name: string): string | undefined {
    return name.match(/^\[\[\.\.\.([^/]+)\]\]$/)?.[1];
}

/** Match `(page)` -> `page` */
export function matchGroupName(name: string): string | undefined {
    return name.match(/^\(([^/]+)\)$/)?.[1];
}
