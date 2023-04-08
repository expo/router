import { requireNativeModule } from "expo-modules-core";
import Constants, { ExecutionEnvironment } from "expo-constants";

let ExpoHead: null | any = null;

if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
  // Loads the native module object from the JSI or falls back to
  // the bridge module (from NativeModulesProxy) if the remote debugger is on.
  ExpoHead = requireNativeModule("ExpoHead");
}

export { ExpoHead };
