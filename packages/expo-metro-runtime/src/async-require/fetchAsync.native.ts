/**
 * Copyright (c) Evan Bacon.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Platform } from "react-native";
// @ts-expect-error
import Networking from "react-native/Libraries/Network/RCTNetworking";

export function fetchAsync(
  url: string
): Promise<{ body: string; headers: Record<string, string> }> {
  let id: string | null = null;
  let responseText: string | null = null;
  let headers: Record<string, string> = {};
  let dataListener: { remove: () => void } | null = null;
  let completeListener: { remove: () => void } | null = null;
  let responseListener: { remove: () => void } | null = null;
  return new Promise<{ body: string; headers: Record<string, string> }>(
    (resolve, reject) => {
      dataListener = Networking.addListener(
        "didReceiveNetworkData",
        ([requestId, response]) => {
          if (requestId === id) {
            responseText = response;
          }
        }
      );
      responseListener = Networking.addListener(
        "didReceiveNetworkResponse",
        ([requestId, status, responseHeaders]) => {
          if (requestId === id) {
            headers = responseHeaders;
          }
        }
      );
      completeListener = Networking.addListener(
        "didCompleteNetworkResponse",
        ([requestId, error]) => {
          if (requestId === id) {
            if (error) {
              reject(error);
            } else {
              resolve({ body: responseText!, headers });
            }
          }
        }
      );
      Networking.sendRequest(
        "GET",
        "asyncRequest",
        url,
        {
          "expo-platform": Platform.OS,
        },
        "",
        "text",
        false,
        0,
        (requestId) => {
          id = requestId;
        },
        true
      );
    }
  ).finally(() => {
    dataListener?.remove();
    completeListener?.remove();
    responseListener?.remove();
  });
}
