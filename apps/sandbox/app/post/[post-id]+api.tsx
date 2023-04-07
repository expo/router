// import { ExpoRequest, ExpoResponse } from "expo-router/server";
import fs from "fs";
import path from "path";

const ExpoResponse =
  global.ExpoResponse as typeof import("expo-router/server").ExpoResponse;

const SUPER_E2E_TEST_SECRET_VALUE = "SUPER_E2E_TEST_SECRET_VALUE";

/** @type {import('expo-router/server').RequestHandler} */
export async function GET(
  req: typeof import("expo-router/server").ExpoRequest
) {
  const pkg = JSON.parse(
    await fs.promises.readFile(
      path.join(__dirname, "../..", "package.json"),
      "utf8"
    )
  );

  console.log(
    ">",
    // pkg,
    // { __dirname, __filename },
    req.expoUrl,
    req.expoUrl.searchParams.get("post-id")
  );
  return ExpoResponse.json({ hey: "world", pkg, SUPER_E2E_TEST_SECRET_VALUE });
}
