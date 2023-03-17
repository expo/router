import type { Request } from "expo-router/server";

const path = require("path");
import fs from "node:fs/promises";

/** @type {import('expo-router/server').RequestHandler} */
export function GET(req) {
  console.log("fs", fs);
  return Response.json({
    hello: "universe!",

    ex: path.join("foo", "bar"),
  });
}

export function POST(req) {
  // curl -d "param1=value1&param2=value2" -X POST http://localhost:19000/data
  return Response.json({ hello: "universe" });
}
