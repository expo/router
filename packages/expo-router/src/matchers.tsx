/** Match `[page]` -> `page` */
export function matchDynamicName(name: string): string | undefined {
  // Don't match `...` or `[` or `]` inside the brackets
  // eslint-disable-next-line no-useless-escape
  return name.match(/^\[([^[\](?:\.\.\.)]+?)\]$/)?.[1];
}

/** Match `[...page]` -> `page` */
export function matchDeepDynamicRouteName(name: string): string | undefined {
  return name.match(/^\[\.\.\.([^/]+?)\]$/)?.[1];
}

/** Match `(page)` -> `page` */
export function matchFragmentName(name: string): string | undefined {
  return name.match(/^\(([^/]+?)\)$/)?.[1];
}

export function getNameFromFilePath(name: string): string {
  return removeSupportedExtensions(removeFileSystemDots(name));
}

/** Remove `.js`, `.ts`, `.jsx`, `.tsx` */
function removeSupportedExtensions(name: string): string {
  return name.replace(/\.[jt]sx?$/g, "");
}

// Remove any amount of `./` and `../` from the start of the string
function removeFileSystemDots(filePath: string): string {
  return filePath.replace(/^(?:\.\.?\/)+/g, "");
}
