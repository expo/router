import "@expo/metro-runtime";

import { LogBoxInspectorContainer } from "@expo/metro-runtime/build/error-overlay/ErrorOverlay";

// export default LogBoxInspectorContainer;

import { registerRootComponent } from "expo";

registerRootComponent(LogBoxInspectorContainer);
