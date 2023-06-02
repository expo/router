/**
 * Copyright © 2022 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getDevServer from "../getDevServer";

export function buildUrlForBundle(bundlePath: string): string {
  if (process.env.NODE_ENV === "production") {
    if (typeof location !== "undefined") {
      return location.origin.replace(/\/+$/, "") + "/" + bundlePath;
    }
    throw new Error(
      'Unable to determine the production URL where additional JavaScript chunks are hosted because the global "location" variable is not defined.'
    );
  }
  const { url: serverUrl } = getDevServer();

  return serverUrl.replace(/\/+$/, "") + "/" + bundlePath;
}
