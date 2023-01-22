import React from "react";

import { RouteNode } from "../Route";
import { Toast } from "./Toast";

export function SuspenseFallback({ route }: { route: RouteNode }) {
  return <Toast filename={route?.contextKey}>Bundling...</Toast>;
}
