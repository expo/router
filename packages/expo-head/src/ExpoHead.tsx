import React from "react";
import * as App from "expo-application";
import ExpoHead from "./ExpoHeadModule";
// import { EventEmitter } from "expo-modules-core";

// const emitter = new EventEmitter(ExpoHead);
// Import the native module. On web, it will be resolved to ExpoHead.web.ts
// and on native platforms to ExpoHead.ts
// Get the native constant value.
export const PI = ExpoHead.PI;

type UserActivity = {
  id?: string;
  /**
   * The activity title should be clear and concise. This text describes the content of the link, like “Photo taken on July 27, 2020” or “Conversation with Maria”. Use nouns for activity titles.
   */
  title?: string;
  description?: string;
  webpageURL?: string;
  keywords?: string[];
  // TODO: Get this automatically somehow
  activityType: string;
  // TODO: Maybe something like robots.txt?
  eligibleForSearch?: boolean;
  phrase?: string;

  thumbnailURL?: string;

  userInfo?: Record<string, string>;

  imageData?: any;

  imageUrl?: string;
  darkImageUrl?: string;
  dateModified?: Date;
  expirationDate?: Date;
};

export function flushActivity() {
  console.log("got launch activity:", ExpoHead.getLaunchActivity());
}

flushActivity();

// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction

// suggestedInvocationPhrase -- `expo:spoken-phrase`
// suggestedInvocationPhrase -- `expo:spoken-phrase`

function getStaticUrlFromExpoRouter(href: string) {
  // Wherever the user hosted their website + base URL.
  const host = "https://expo.io";
  // Append the URL we'd find in context
  return host + "/" + href;
}

function urlToId(url: string) {
  return url.replace(/[^a-zA-Z0-9]/g, "-");
}

// Maybe use geo from structured data -- https://developers.google.com/search/docs/appearance/structured-data/local-business

import { useLink } from "expo-router";
// import { useContextKey } from "expo-router/build/Route";
// import { AppState, Linking } from "react-native";
export function Head({ children }: { children?: React.ReactNode }) {
  const link = useLink();

  React.useEffect(() => {
    const userActivity: UserActivity = {
      activityType: ExpoHead.activities.INDEXED_ROUTE,
    };

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }
      if (child.type === "title") {
        userActivity.title = child.props.children;
      }
      // Child is meta tag
      if (child.type === "meta") {
        const { property, name, media, content } = child.props;

        // <meta name="title" content="Hello world" />
        if (property === "og:title" || name === "title") {
          userActivity.title = content;
        }

        if (property === "og:description" || name === "description") {
          userActivity.description = content;
        }
        // if (property === "expo:spoken-phrase") {
        //   userActivity.phrase = content;
        // }

        // <meta property="og:url" content="https://expo.io/foobar" />
        if ("og:url" === property || "url" === name) {
          userActivity.webpageURL = content;
        }

        if (property === "og:image") {
          if (media === "(prefers-color-scheme: dark)") {
            console.log("SETTING DARK IMAGE URL", content);
            userActivity.darkImageUrl = content;
          } else {
            console.log("SETTING IMAGE URL", content);
            userActivity.imageUrl = content;
          }
        }

        // <meta name="keywords" content="foo,bar,baz" />
        if (["keywords"].includes(name)) {
          userActivity.keywords = Array.isArray(content)
            ? content
            : content.split(",");
        }
      }
    });

    if (userActivity.title) {
      const resolved: UserActivity = {
        webpageURL: getStaticUrlFromExpoRouter(link.href),
        eligibleForSearch: true,
        keywords: [],
        ...userActivity,
        // dateModified: new Date().toISOString(),
        userInfo: {
          href: link.location,
        },
      };

      if (App.applicationName) {
        resolved.keywords?.push(App.applicationName);
      }

      if (!resolved.id) {
        resolved.id = urlToId(resolved.webpageURL!);
      }

      console.log("create:", resolved);
      ExpoHead.createActivity(resolved);
    }
  }, [children, link.href]);

  // React.useEffect(() => {
  //   return () => {
  //     // https://developer.apple.com/documentation/foundation/nsuseractivity/1409596-resigncurrent
  //     ExpoHead.suspendActivity("[TODO-SOME-PAGE-ID]");
  //   };
  // }, []);

  return null;
}
