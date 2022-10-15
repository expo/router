import * as App from "expo-application";
import { createURL } from "expo-linking";
import { useHref } from "expo-router";
import React from "react";

import ExpoHead from "./ExpoHeadModule.native";

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

  /** Local file path for an image */
  imageUrl?: string;
  darkImageUrl?: string;
  dateModified?: Date;
  expirationDate?: Date;
};

// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction

// suggestedInvocationPhrase -- `expo:spoken-phrase`

let webUrl: string = "";

export function setWebUrl(url: string) {
  // Wherever the user hosted their website + base URL.
  webUrl = url.replace(/\/$/, "");
}

function getStaticUrlFromExpoRouter(href: string) {
  // const host = "https://expo.io";
  // Append the URL we'd find in context
  return webUrl + "/" + href;
}

function urlToId(url: string) {
  return url.replace(/[^a-zA-Z0-9]/g, "-");
}

// Maybe use geo from structured data -- https://developers.google.com/search/docs/appearance/structured-data/local-business

// import { useContextKey } from "expo-router/build/Route";
// import { AppState, Linking } from "react-native";
export function Head({ children }: { children?: React.ReactNode }) {
  const link = useHref();

  const activity = React.useMemo(() => {
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
            // console.log("SETTING DARK IMAGE URL", content);
            userActivity.darkImageUrl = content;
          } else {
            // console.log("SETTING IMAGE URL", content);
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
          href: createURL(link.href),
        },
      };

      if (App.applicationName) {
        resolved.keywords?.push(App.applicationName);
      }

      if (!resolved.id) {
        resolved.id = urlToId(resolved.webpageURL!);
      }

      // console.log("create:", resolved);
      return resolved;
    }
    return null;
  }, [children, link.href]);

  React.useEffect(() => {
    if (activity) {
      ExpoHead.createActivity(activity);
    } else {
      // ExpoHead.revokeActivity();
    }
  }, [activity]);

  // React.useEffect(() => {
  //   return () => {
  //     // https://developer.apple.com/documentation/foundation/nsuseractivity/1409596-resigncurrent
  //     ExpoHead.suspendActivity("[TODO-SOME-PAGE-ID]");
  //   };
  // }, []);

  return null;
}
