// import { ExpoRequest, ExpoResponse } from "expo-router/server";
import { fileURLToPath } from "url";
import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const ExpoRequest =
  global.ExpoRequest as typeof import("expo-router/server").ExpoRequest;
const ExpoResponse =
  global.ExpoResponse as typeof import("expo-router/server").ExpoResponse;

const SUPER_E2E_TEST_SECRET_VALUE = "SUPER_E2E_TEST_SECRET_VALUE";

/** @type {import('expo-router/server').RequestHandler} */
export async function GET(
  req: typeof import("expo-router/server").ExpoRequest
) {
  console.log(
    ">",
    { __dirname, __filename },
    req.expoUrl,
    req.expoUrl.searchParams.get("post-id")
  );
  return ExpoResponse.json({ hey: "world" });
}
