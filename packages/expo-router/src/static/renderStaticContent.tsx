/**
 * Copyright © 2023 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ServerContainerRef } from "@react-navigation/native";
// We use the value from `main` in the `package.json` since this
// should only be accessed from processes that are running in Node.js and
// conform to using `mainFields: ['main']` in their bundler config.
// @ts-expect-error
import ServerContainer from "@react-navigation/native/lib/commonjs/ServerContainer";
import App, { getManifest } from "expo-router/_entry";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { AppRegistry } from "react-native-web";

import { getRootComponent } from "./getRootComponent";
import Head from "../head/Head";

AppRegistry.registerComponent("App", () => App);

export function getStaticContent(location: URL): string {
  const headContext: { helmet?: any } = {};

  const ref = React.createRef<ServerContainerRef>();

  const {
    // Skipping the `element` that's returned to ensure the HTML
    // matches what's used in the client -- this results in two extra Views and
    // the seemingly unused `RootTagContext.Provider` from being added.
    getStyleElement,
  } = AppRegistry.getApplication("App");

  const Root = getRootComponent();

  const out = React.createElement(Root, {
    // TODO: Use RNW view after they fix hydration for React 18
    // https://github.com/necolas/react-native-web/blob/e8098fd029102d7801c32c1ede792bce01808c00/packages/react-native-web/src/exports/render/index.js#L10
    // Otherwise this wraps the app with two extra divs
    children:
      // Inject the root tag using createElement to prevent any transforms like the ones in `@expo/html-elements`.
      React.createElement(
        "div",
        {
          id: "root",
        },
        <App />
      ),
  });

  const html = ReactDOMServer.renderToString(
    <Head.Provider context={headContext}>
      <ServerContainer ref={ref} location={location}>
        {out}
      </ServerContainer>
    </Head.Provider>
  );

  // Eval the CSS after the HTML is rendered so that the CSS is in the same order
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  let output = mixHeadComponentsWithStaticResults(headContext.helmet, html);

  output = output.replace("</head>", `${css}</head>`);

  return "<!DOCTYPE html>" + output;
}

function mixHeadComponentsWithStaticResults(helmet: any, html: string) {
  // Head components
  for (const key of [
    "title",
    "priority",
    "meta",
    "link",
    "script",
    "style",
  ].reverse()) {
    const result = helmet?.[key]?.toString();
    if (result) {
      html = html.replace("<head>", `<head>${result}`);
    }
  }

  // attributes
  html = html.replace("<html ", `<html ${helmet?.htmlAttributes.toString()} `);
  html = html.replace("<body ", `<body ${helmet?.bodyAttributes.toString()} `);

  return html;
}

// Re-export for use in server
export { getManifest };
