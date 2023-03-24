import { ExpoRequest, ExpoResponse } from "expo-router/server";

const SUPER_E2E_TEST_SECRET_VALUE = "SUPER_E2E_TEST_SECRET_VALUE";

/** @type import('expo-router/server').RequestHandler */
export async function GET(req: ExpoRequest) {
  console.log(">", req.expoUrl, req.expoUrl.searchParams.get("post-id"));
  return ExpoResponse.json({ hey: "world" });
  // return Response.json({
  //   message: "Hello World!",
  // });
}
