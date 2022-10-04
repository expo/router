import React from "react";

import ExpoHead from "./ExpoHeadModule";

// Import the native module. On web, it will be resolved to ExpoHead.web.ts
// and on native platforms to ExpoHead.ts
// Get the native constant value.
export const PI = ExpoHead.PI;

type UserActivity = {
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
};

// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction

// suggestedInvocationPhrase -- `expo:spoken-phrase`
// suggestedInvocationPhrase -- `expo:spoken-phrase`

function getStaticUrlFromExpoRouter() {
  // Wherever the user hosted their website + base URL.
  const host = "https://expo.io";
  // Append the URL we'd find in context
  return host + "/foobar";
}

// Maybe use geo from structured data -- https://developers.google.com/search/docs/appearance/structured-data/local-business

export function Head({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    const userActivity: UserActivity = {
      activityType: "...",
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
        const { property, name, content } = child.props;

        // <meta name="title" content="Hello world" />
        if (property === "og:title" || name === "title") {
          userActivity.title = content;
        }

        if (property === "og:description" || name === "description") {
          userActivity.description = content;
        }

        // <meta property="og:url" content="https://expo.io/foobar" />
        if ("og:url" === property || "url" === name) {
          userActivity.webpageURL = content;
        } else {
          userActivity.webpageURL = getStaticUrlFromExpoRouter();
        }

        // <meta name="keywords" content="foo,bar,baz" />
        if (["keywords"].includes(name)) {
          userActivity.keywords = Array.isArray(content)
            ? content
            : content.split(",");
        }
      }
    });

    ExpoHead.createActivity(userActivity);
  }, [children]);

  React.useEffect(() => {
    return () => {
      // https://developer.apple.com/documentation/foundation/nsuseractivity/1409596-resigncurrent
      ExpoHead.suspendActivity("[TODO-SOME-PAGE-ID]");
    };
  }, []);

  return null;
}
