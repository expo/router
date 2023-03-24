import { ExpoResponse } from "expo-router/server";

import { E2E_TEST_SECRET_VALUE_1 } from "../../etc/secrets";

/** @type import('expo-router/server').RequestHandler */
export async function GET() {
  return ExpoResponse.json({
    message: "Hello World!" + E2E_TEST_SECRET_VALUE_1,
  });
}
