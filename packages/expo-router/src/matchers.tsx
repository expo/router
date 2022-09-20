/** Match `[page]` -> `page` */
export function matchDynamicName(name: string): string | undefined {
    // Don't match `...` or `[` or `]` inside the brackets
    return name.match(/^\[([^/\[\](?:\.\.\.)]+?)\]$/)?.[1];
}

/** Match `[...page]` -> `page` */
export function matchDeepDynamicRouteName(name: string): string | undefined {
    return name.match(/^\[\.\.\.([^/]+?)\]$/)?.[1];
}

/** Match `(page)` -> `page` */
export function matchFragmentName(name: string): string | undefined {
    return name.match(/^\(([^/]+?)\)$/)?.[1];
}
