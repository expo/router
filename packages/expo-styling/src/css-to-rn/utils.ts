export function exhaustiveCheck(value: never) {
  throw new Error(`Unhandled case: ${value}`);
}

export function kebabToCamelCase(str: string) {
  return str.replace(/-./g, (x) => x[1].toUpperCase());
}
