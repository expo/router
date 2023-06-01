/**
 * Copyright © 2023 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ServerContainer, ServerContainerRef } from "@react-navigation/native";
import App, { getManifest } from "expo-router/_entry";
import Head from "expo-router/head";
import React from "react";
import { AppRegistry } from "react-native-web";

import { getRootComponent } from "./getRootComponent";

const ReactDOMServer =
  require("react-dom/server.node") as typeof import("react-dom/server");
AppRegistry.registerComponent("App", () => App);

function resetReactNavigationContexts() {
  // https://github.com/expo/router/discussions/588
  // https://github.com/react-navigation/react-navigation/blob/9fe34b445fcb86e5666f61e144007d7540f014fa/packages/elements/src/getNamedContext.tsx#LL3C1-L4C1

  // React Navigation is storing providers in a global, this is fine for the first static render
  // but subsequent static renders of Stack or Tabs will cause React to throw a warning. To prevent this warning, we'll reset the globals before rendering.
  const contexts = "__react_navigation__elements_contexts";
  // @ts-expect-error: global
  global[contexts] = new Map<string, React.Context<any>>();
}

export async function getStaticContent(location: URL): Promise<string> {
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
        <App location={location} />
      ),
  });

  // This MUST be run before `ReactDOMServer.renderToString` to prevent
  // "Warning: Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
  resetReactNavigationContexts();

  const html = await renderToStaticMarkupAsync(
    <Head.Provider context={headContext}>
      <ServerContainer ref={ref}>{out}</ServerContainer>
    </Head.Provider>
  );

  // Eval the CSS after the HTML is rendered so that the CSS is in the same order
  const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

  let output = mixHeadComponentsWithStaticResults(headContext.helmet, html);

  output = output.replace("</head>", `${css}</head>`);

  return "<!DOCTYPE html>" + output;
}

async function renderToStaticMarkupAsync(
  ...args: Parameters<typeof ReactDOMServer.renderToStaticNodeStream>
): Promise<string> {
  try {
    const pipeableStream = ReactDOMServer.renderToStaticNodeStream(...args);

    let html: string = "";

    for await (const chunk of pipeableStream) {
      html += chunk;
    }

    return html;
  } catch (error) {
    console.error("Failed to statically render HTML", error);
    throw error;
  }
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
