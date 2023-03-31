import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Toast } from "./Toast";
import { useRouteNode } from "../Route";

export function EmptyRoute() {
  const route = useRouteNode();

  return (
    <SafeAreaView collapsable={false} style={{ flex: 1 }}>
      <Toast warning filename={route?.contextKey}>
        Missing default export
      </Toast>
    </SafeAreaView>
  );
}
