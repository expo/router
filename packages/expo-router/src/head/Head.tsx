import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Head = (({ children }: { children?: React.ReactNode }) => {
  return <Helmet>{children}</Helmet>;
}) as React.FC & {
  Provider: typeof HelmetProvider;
};

Head.Provider = HelmetProvider;

export default Head;
