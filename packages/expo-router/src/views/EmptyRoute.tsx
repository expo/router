import React from "react";

import { useRouteNode } from "../Route";
import { Toast } from "./Toast";

export function EmptyRoute() {
  const route = useRouteNode();
  return (
    <Toast warning filename={route?.contextKey}>
      Missing default export
    </Toast>
  );
}
