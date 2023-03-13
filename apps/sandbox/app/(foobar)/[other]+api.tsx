import type { Request } from "expo-router/server";

/** @type {import('expo-router/server').RequestHandler} */
export function GET(req) {
  // console.log(req);
  return Response.json({ hello: "other!!!" + req.url });
}
