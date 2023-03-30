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

function getUrlFromConstants() {
  // This will require a rebuild in bare-workflow to update.
  const manifest =
    Constants.expoConfig || Constants.manifest2 || Constants.manifest;

  // @ts-expect-error
  const origin = manifest?.extra?.router?.handoffOrigin;

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
  return getUrlFromConstants() + pathname;
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
        const { property, content } = child.props;

        switch (property) {
          case "og:title":
            userActivity.title = content;
            break;
          case "og:description":
            userActivity.description = content;
            break;
          case "og:url":
            userActivity.webpageURL = content;
            break;
          case "expo:handoff":
            userActivity.isEligibleForHandoff = [true, "true", ""].includes(
              content
            );
            break;
        }

        // // <meta name="keywords" content="foo,bar,baz" />
        // if (["keywords"].includes(name)) {
        //   userActivity.keywords = Array.isArray(content)
        //     ? content
        //     : content.split(",");
        // }
      }
    });
    const resolved: UserActivity = {
      webpageURL: href,
      keywords: [userActivity.title!],
      ...userActivity,
      userInfo: {
        href: pathname,
      },
      // dateModified: new Date().toISOString(),
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

Head.Provider = React.Fragment;
