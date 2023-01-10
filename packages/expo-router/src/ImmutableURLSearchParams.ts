import { URLSearchParams } from "./URLSearchParams";

export class ImmutableURLSearchParams extends URLSearchParams {
  set() {
    throw new Error("Cannot set on immutable URLSearchParams");
  }
  append() {
    throw new Error("Cannot append on immutable URLSearchParams");
  }
  delete(name: string): void {
    throw new Error("Cannot delete on immutable URLSearchParams");
  }
  sort() {
    throw new Error("Cannot sort on immutable URLSearchParams");
  }
}
