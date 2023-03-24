import { ExpoResponse } from "expo-router/server";

// Ensure this value isn't included in the client bundle
const E2E_TEST_SECRET_VALUE_2 = "E2E_TEST_SECRET_VALUE_2";
console.log(E2E_TEST_SECRET_VALUE_2);

/** @type import('expo-router/server').RequestHandler */
export async function GET() {
  return ExpoResponse.json({
    message: "Hello World!",
  });
}
