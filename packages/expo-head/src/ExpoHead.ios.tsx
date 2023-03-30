import Constants from "expo-constants";
import { usePathname, useSearchParams } from "expo-router";
import React from "react";

import ExpoHead from "./ExpoHeadModule.native";

// isEligibleForPrediction
// https://developer.apple.com/documentation/foundation/nsuseractivity/2980674-iseligibleforprediction

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
  phrase?: string;

  thumbnailURL?: string;

  userInfo?: Record<string, string>;

  isEligibleForHandoff?: boolean;
  isEligibleForPrediction?: boolean;
  isEligibleForSearch?: boolean;

  /** Local file path for an image */
  imageUrl?: string;
  darkImageUrl?: string;
  dateModified?: Date;
  expirationDate?: Date;
};

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

function getUrlFromConstants() {
  const origin = Constants.manifest?.extra?.router?.handoffOrigin;

  if (!origin) {
    throw new Error(
      `Add the handoff origin to the native manifest under "extra.router.handoffOrigin"`
    );
  }

  if (!/^https?:\/\//.test(origin)) {
    throw new Error(
      'Expo Head: Web URL must start with "http://" or "https://"'
    );
  }

  return origin.replace(/\/$/, "");
}

function getStaticUrlFromExpoRouter(pathname: string) {
  // const host = "https://expo.io";
  // Append the URL we'd find in context
  return getWebUrl() + pathname;
}
function getWebUrl() {
  if (!webUrl) {
    return getUrlFromConstants();
    // webUrl = setDefaultWebUrl();
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

// TODO: Use Head Provider to collect all props so only one Head is rendered for a given route.

export function Head({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams<{ q?: string }>();

  const href = React.useMemo(() => {
    const qs = new URLSearchParams(params).toString();
    const url = getStaticUrlFromExpoRouter(pathname);
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
        const { property, name, content } = child.props;
        // <meta name="title" content="Hello world" />
        if (property === "og:title" || name === "title") {
          userActivity.title = content;
        }
        if (property === "og:description" || name === "description") {
          userActivity.description = content;
        }
        if (property === "expo:handoff") {
          userActivity.isEligibleForHandoff = [true, "true", ""].includes(
            content
          );
        }

        // <meta property="og:url" content="https://expo.io/foobar" />
        if ("og:url" === property || "url" === name) {
          userActivity.webpageURL = content;
        }

        // <meta name="keywords" content="foo,bar,baz" />
        if (["keywords"].includes(name)) {
          userActivity.keywords = Array.isArray(content)
            ? content
            : content.split(",");
        }
      }
    });
    const resolved: UserActivity = {
      webpageURL: href,
      keywords: [userActivity.title!],
      // isEligibleForSearch: true,
      ...userActivity,
      // dateModified: new Date().toISOString(),
      userInfo: {
        href: pathname,
      },
    };

    if (!resolved.id && resolved.webpageURL) {
      resolved.id = urlToId(resolved.webpageURL);
    }
    return resolved;
  }, [metaChildren, pathname, href]);

  useRegisterCurrentActivity(activity);

  return renderableChildren;
}

function useRegisterCurrentActivity(activity: UserActivity) {
  React.useEffect(() => {
    if (activity) {
      if (!activity.id) {
        throw new Error("Activity must have an ID");
      }

      // If no features are enabled, then skip registering the activity
      if (activity.isEligibleForHandoff || activity.isEligibleForSearch) {
        ExpoHead.createActivity(activity);
        return () => {
          if (activity?.id) {
            ExpoHead.suspendActivity(activity.id);
          }
        };
      }
    }
    return () => {};
  }, [activity]);
}
