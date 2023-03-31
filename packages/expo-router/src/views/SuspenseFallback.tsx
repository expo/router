import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Toast } from "./Toast";
import { RouteNode } from "../Route";

export function SuspenseFallback({ route }: { route: RouteNode }) {
  return (
    <SafeAreaView collapsable={false} style={{ flex: 1 }}>
      <Toast filename={route?.contextKey}>Bundling...</Toast>
    </SafeAreaView>
  );
}
