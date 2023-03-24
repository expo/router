import { Response } from "expo-router/server";

/** @type import('expo-router/server').RequestHandler */
export async function GET() {
  return Response.json({
    message: "Hello World!",
  });
}
