import React from "react";
import NotFound from "@theme-original/NotFound";
import Redirect from "../components/redirect";

export default function NotFoundWrapper(props) {
  return (
    <>
      <Redirect to="https://docs.expo.dev/router/introduction/" />;
      <NotFound {...props} />
    </>
  );
}
