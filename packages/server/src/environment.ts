import {
  installGlobals as installRemixGlobals,
  Response,
  RequestInit,
  RequestInfo,
  Request,
} from "@remix-run/node";

import { URL } from "node:url";

// Ensure these are available for the API Routes.
export function installGlobals() {
  installRemixGlobals();

  // @ts-expect-error
  global.Request = ExpoRequest;
  // @ts-expect-error
  global.Response = ExpoResponse;
  // @ts-expect-error
  global.ExpoResponse = ExpoResponse;
  // @ts-expect-error
  global.ExpoRequest = ExpoRequest;
}

export class ExpoResponse extends Response {
  // TODO: Drop when we upgrade to node-fetch v3
  static json(data: any = undefined, init: ResponseInit = {}): ExpoResponse {
    const body = JSON.stringify(data);

    if (body === undefined) {
      throw new TypeError("data is not JSON serializable");
    }

    const headers = new Headers(init?.headers);

    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    return new ExpoResponse(body, {
      ...init,
      headers,
    });
  }
}

export const NON_STANDARD_SYMBOL = Symbol("non-standard");

export class ExpoURL extends URL {}

export class ExpoRequest extends Request {
  [NON_STANDARD_SYMBOL]: {
    url: ExpoURL;
  };

  constructor(info: RequestInfo, init?: RequestInit) {
    super(info, init);

    const url =
      typeof info !== "string" && "url" in info ? info.url : String(info);

    this[NON_STANDARD_SYMBOL] = {
      url: new ExpoURL(url),
    };
  }

  public get expoUrl() {
    return this[NON_STANDARD_SYMBOL].url;
  }
}
