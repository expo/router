import React from "react";

import { Toast } from "./Toast";
import { RouteNode } from "../Route";

export function SuspenseFallback({ route }: { route: RouteNode }) {
  return <Toast filename={route?.contextKey}>Bundling...</Toast>;
}
