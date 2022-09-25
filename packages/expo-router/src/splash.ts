import Constants, { ExecutionEnvironment } from "expo-constants";

let SplashModule: typeof import("expo-splash-screen") | null = null;

try {
  if (Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) {
    SplashModule = require("expo-splash-screen");
  }
} catch (e) {
  // Ignore
}

export default SplashModule;
