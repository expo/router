import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Head = (({ children }: { children?: any }) => {
  return <Helmet>{children}</Helmet>;
}) as any & {
  Provider: typeof HelmetProvider;
};

Head.Provider = HelmetProvider;
