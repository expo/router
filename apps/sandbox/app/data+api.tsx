import type { Request } from "expo-router/server";

/** @type {import('expo-router/server').RequestHandler} */
export function GET(req) {
  return Response.json({ hello: "universe" });
}

export function POST(req) {
  // curl -d "param1=value1&param2=value2" -X POST http://localhost:19000/other
  console.log(">>", req);
  return Response.json({ hello: "universe" });
}
