// import URL from "url-parse";
import * as App from "expo-application";
// import { createURL } from "expo-linking";
import { usePathname, useSearchParams } from "expo-router";
import React from "react";
import Constants from "expo-constants";

import ExpoHead from "./ExpoHeadModule.native";
// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction
// suggestedInvocationPhrase -- `expo:spoken-phrase`

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

function getWebUrlsFromManifest() {
  // TODO: Replace this with the source of truth native manifest
  // Then do a check to warn the user if the config doesn't match the native manifest.
  // TODO: Warn if the applinks have `https://` in them.
  const domains = Constants.expoConfig?.ios?.associatedDomains || [];
  // [applinks:explore-api.netlify.app/] -> [explore-api.netlify.app]
  const applinks = domains
    .filter((domain) => domain.startsWith("applinks:"))
    .map((domain) => {
      const clean = domain.replace(/^applinks:/, "");
      return clean.endsWith("/") ? clean.slice(0, -1) : clean;
    });
  const withoutCustom = applinks.filter(
    (domain) =>
      !domain.match(
        /\?mode=(developer|managed|developer\+managed|managed\+developer)$/
      )
  );
  return withoutCustom;
}
function setDefaultWebUrl() {
  const webUrls = getWebUrlsFromManifest();
  if (!webUrls.length) {
    throw new Error(
      `No web URL found in the native manifest. Please add a web URL to the native manifest.`
    );
  }
  if (webUrls.length > 1) {
    console.warn(
      `Multiple web URLs found in the native manifest associatedDomains. Using the first one found: ${webUrls[0]}`
    );
  }
  return "https://" + webUrls[0];
}
let webUrl: string = "";

export function setWebUrl(url: string) {
  // Wherever the user hosted their website + base URL.
  webUrl = url.replace(/\/$/, "");

  if (!/^https?:\/\//.test(webUrl)) {
    throw new Error(
      'Expo Head: Web URL must start with "http://" or "https://"'
    );
  }
}

if (!webUrl && typeof window !== "undefined" && window.location?.origin) {
  setWebUrl(window.location.origin);
}

function getStaticUrlFromExpoRouter(pathname: string) {
  // const host = "https://expo.io";
  // Append the URL we'd find in context
  return getWebUrl() + pathname;
}
function getWebUrl() {
  if (!webUrl) {
    webUrl = setDefaultWebUrl();
  }
  return webUrl;
}
function urlToId(url: string) {
  return url.replace(/[^a-zA-Z0-9]/g, "-");
}
function getLastSegment(path: string) {
  // Remove the extension
  const lastSegment = path.split("/").pop() ?? "";
  return lastSegment.replace(/\.[^/.]+$/, "").split("?")[0];
}

// Maybe use geo from structured data -- https://developers.google.com/search/docs/appearance/structured-data/local-business
// import { useContextKey } from "expo-router/build/Route";
// import { AppState, Linking } from "react-native";
export function Head({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams<{ q?: string }>();

  const href = React.useMemo(() => {
    const qs = new URLSearchParams(params).toString();

    const url = getStaticUrlFromExpoRouter(pathname);

    console.log("url:", url + "?" + qs);
    if (qs) {
      return url + "?" + qs;
    }
    return url;
  }, [pathname, params?.q]);

  const { renderableChildren, metaChildren } = React.useMemo(() => {
    const renderableChildren = [];
    const metaChildren: any[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }
      if (typeof child.type === "string") {
        metaChildren.push(child);
      } else {
        renderableChildren.push(child);
      }
    });

    return { renderableChildren, metaChildren };
  }, [children]);

  console.log("children:", renderableChildren, metaChildren);

  const activity = React.useMemo(() => {
    const userActivity: UserActivity = {
      title: getLastSegment(pathname),
      activityType: ExpoHead.activities.INDEXED_ROUTE,
    };

    metaChildren.forEach((child) => {
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
          //     if (media === "(prefers-color-scheme: dark)") {
          // console.log("SETTING DARK IMAGE URL", content);
          userActivity.darkImageUrl = content;
          //     }
          //     else {
          //         // console.log("SETTING IMAGE URL", content);
          //         userActivity.imageUrl = content;
          //     }
        }
        // <meta name="keywords" content="foo,bar,baz" />
        if (["keywords"].includes(name)) {
          userActivity.keywords = Array.isArray(content)
            ? content
            : content.split(",");
        }
      }
    });
    const resolved = {
      webpageURL: href,
      eligibleForSearch: true,
      keywords: [userActivity.title],
      isEligibleForHandoff: true,
      isEligibleForPrediction: true,
      isEligibleForSearch: true,
      ...userActivity,
      // dateModified: new Date().toISOString(),
      userInfo: {
        href: pathname,
      },
    };
    if (App.applicationName) {
      resolved.keywords?.push(App.applicationName);
    }
    if (!resolved.id) {
      resolved.id = urlToId(resolved.webpageURL);
    }
    return resolved;
  }, [metaChildren, pathname, href]);
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
  return renderableChildren;
}
