import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Head = (({ children }: { children?: any }) => {
  return <Helmet>{children}</Helmet>;
}) as any & {
  Provider: typeof HelmetProvider;
};

Head.Provider = HelmetProvider;

export default Head;
