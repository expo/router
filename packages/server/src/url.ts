// import { pathToRegexp, decode } from "path-to-regexp";

// // Given a formatted URL like `/:foo/bar/:baz*` and a URL pathname like `/hello/bar/world?other=1`
// // return the processed search params like `{ baz: 'world', foo: 'hello', other: '1' }`
// export function getParamsFromPath(path: string, pathname: string) {
//   const keys = [];
//   const re = pathToRegexp(path, keys);
//   const m = re.exec(pathname);
//   if (!m) {
//     return null;
//   }
//   const params = {};
//   for (let i = 1; i < m.length; i++) {
//     const key = keys[i - 1];
//     const prop = key.name;
//     const val = decode(m[i]);
//     if (val !== undefined || !Object.hasOwnProperty.call(params, prop)) {
//       params[prop] = val;
//     }
//   }
//   return params;
// }
