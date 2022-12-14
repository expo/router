// TODO: Use the global type
export interface RequireContext {
  /** Return the keys that can be resolved. */
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  /** **Unimplemented:** Return the module identifier for a user request. */
  resolve(id: string): string;
  /** **Unimplemented:** Readable identifier for the context module. */
  id: string;
}
