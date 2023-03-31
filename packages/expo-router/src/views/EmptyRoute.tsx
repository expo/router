import React from "react";

import { Toast } from "./Toast";
import { useRouteNode } from "../Route";

export function EmptyRoute() {
  const route = useRouteNode();
  return (
    <Toast warning filename={route?.contextKey}>
      Missing default export
    </Toast>
  );
}
