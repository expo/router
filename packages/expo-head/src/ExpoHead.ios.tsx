import { usePathname, useSearchParams, useSegments } from "expo-router";
import React from "react";

import { ExpoHead, UserActivity } from "./ExpoHeadModule";
import { getStaticUrlFromExpoRouter } from "./url";

function urlToId(url: string) {
  return url.replace(/[^a-zA-Z0-9]/g, "-");
}

function getLastSegment(path: string) {
  // Remove the extension
  const lastSegment = path.split("/").pop() ?? "";
  return lastSegment.replace(/\.[^/.]+$/, "").split("?")[0];
}

// TODO: Use Head Provider to collect all props so only one Head is rendered for a given route.

function useAddressableLink() {
  const pathname = usePathname();
  const params = useSearchParams<{ q?: string }>();
  const qs = new URLSearchParams(params).toString();
  let url = getStaticUrlFromExpoRouter(pathname);
  if (qs) {
    url += "?" + qs;
  }
  return { url, pathname, params };
}

type MetaNode =
  | React.ReactPortal
  | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;

function useMetaChildren(children: React.ReactNode) {
  return React.useMemo(() => {
    const renderableChildren: React.ReactNode[] = [];
    const metaChildren: MetaNode[] = [];

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

    return { children, metaChildren };
  }, [children]);
}

function useActivityFromMetaChildren(meta: MetaNode[]) {
  const { url: href, pathname } = useAddressableLink();

  return React.useMemo(() => {
    const userActivity: UserActivity = {
      title: getLastSegment(pathname),
      activityType: ExpoHead!.activities.INDEXED_ROUTE,
    };

    meta
      // This attempts to prioritize the more specific meta tags.
      // https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/WebContent.html#//apple_ref/doc/uid/TP40016308-CH8-SW3
      .sort((a, b) => {
        if (a.type === b.type) {
          return 0;
        }

        // More specific tags should be prioritized
        if (a.type === "meta") {
          return 1;
        } else if (b.type === "meta") {
          return -1;
        }

        return 0;
      })
      .forEach((child) => {
        if (
          // <title />
          child.type === "title"
        ) {
          userActivity.title = child.props.children;
        } else if (
          // <meta />
          child.type === "meta"
        ) {
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
            // Custom properties
            case "expo:handoff":
              userActivity.isEligibleForHandoff = isTruthy(content);
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
    };

    if (!resolved.id && resolved.webpageURL) {
      resolved.id = urlToId(resolved.webpageURL);
    }
    return resolved;
  }, [meta, pathname, href]);
}

function isTruthy(value: any): boolean {
  return [true, "true"].includes(value);
}

function HeadNative(props: { children?: React.ReactNode }) {
  const { metaChildren, children } = useMetaChildren(props.children);
  const activity = useActivityFromMetaChildren(metaChildren);
  useRegisterCurrentActivity(activity);
  return children;
}

// segments => activity
const activities: Map<string, UserActivity> = new Map();

function useRegisterCurrentActivity(activity: UserActivity) {
  // ID is tied to Expo Router and agnostic of URLs to ensure dynamic parameters are not considered.
  const activityId = useSegments().join("/");

  const cascadingActivity: UserActivity = activities.get(activityId)
    ? {
        ...activities.get(activityId),
        ...activity,
      }
    : {
        ...activity,
        id: activityId,
      };

  activities.set(activityId, cascadingActivity);

  React.useEffect(() => {
    if (cascadingActivity) {
      if (!cascadingActivity.id) {
        throw new Error("Activity must have an ID");
      }

      // If no features are enabled, then skip registering the activity
      if (
        cascadingActivity.isEligibleForHandoff ||
        cascadingActivity.isEligibleForSearch
      ) {
        ExpoHead?.createActivity(cascadingActivity);
        return () => {
          if (cascadingActivity?.id) {
            ExpoHead?.suspendActivity(cascadingActivity.id);
          }
        };
      }
    }
    return () => {};
  }, [cascadingActivity]);
}
HeadNative.Provider = React.Fragment;

function HeadShim(props: { children?: React.ReactNode }) {
  return null;
}
HeadShim.Provider = React.Fragment;

// Native Head is only enabled in bare iOS apps.
export const Head: ((props: {
  children?: React.ReactNode;
}) => React.ReactNode) & {
  Provider: React.ComponentType;
} = ExpoHead ? HeadNative : HeadShim;
