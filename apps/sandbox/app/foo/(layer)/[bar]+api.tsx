import type { Request } from "../../../../../../expo/node_modules/@remix-run/node";

import path from "path";
import fs from "node:fs/promises";

/** @type {import('expo-router/server').RequestHandler} */
export function GET(req: Request) {
  console.log("fs", req.url);
  return Response.json({
    hello: "Data",
    ex: path.join("foo", "bar"),
  });
}
