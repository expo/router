import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";

polyfillGlobal(
  "URLSearchParams",
  () => require("whatwg-url-without-unicode").URLSearchParams
);

export const URLSearchParams =
  require("whatwg-url-without-unicode").URLSearchParams;
