import { Platform } from "react-native";

import { buildUrlForBundle } from "./buildUrlForBundle";
import { fetchThenEvalAsync } from "./fetchThenEval";
import HMRClient from "../HMRClient";
import LoadingView from "../LoadingView";

let pendingRequests = 0;

/**
 * Load a bundle for a URL using fetch + eval on native and script tag injection on web.
 *
 * @param bundlePath Given a statement like `import('./Bacon')` `bundlePath` would be `Bacon`.
 */
export function loadBundleAsync(bundlePath: string): Promise<void> {
  const requestUrl = buildUrlForBundle(bundlePath, {
    modulesOnly: "true",
    runModule: "false",
    platform: Platform.OS,
    // The JavaScript loader does not support bytecode.
    runtimeBytecodeVersion: null,
  });

  // Send a signal to the `expo` package to show the loading indicator.
  LoadingView.showMessage("Downloading...", "load");
  pendingRequests++;

  return fetchThenEvalAsync(requestUrl)
    .then(() => {
      HMRClient.registerBundle(requestUrl);
    })
    .finally(() => {
      if (!--pendingRequests) {
        LoadingView.hide();
      }
    });
}
