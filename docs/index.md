# Expo Router RFC

The goal is to create a routing system that is automatically generated based on the app's file system. Routes will prioritize nesting as this is a basic requirement for native navigation, the system is analogous to Remix and the upcoming Next.js layouts API.

## Challenges

This concept is new to native apps, and common to web frameworks like PHP, Next.js, Remix, SvelteKit, etc.
Unlike the web, native apps have some constraints that make this more difficult:

- **Behavior:** Users expect native navigation to abide by an extensive list of common rules. For example, popping a stack of screens to the top when a selected tab is pressed, and scrolling to the top of the page when the selected tab is pressed again.
- **Performance:** Native navigation utilizes native primitives like `UINavigationController` on iOS and `Fragment` on Android. These primitives enable critical performance optimizations like skipping the render of screens that are not visible.
- **Animation:** Native navigation has a set of common animations that are expected to be used when navigating between screens. These animations are also optimized to run at 60 FPS. Complex animations like shared element transitions should also be possible.
- **Offline:** Native apps must run offline-first and be able to navigate to any screen without a server. This means that the router must have an option to run on the client in native environments. The file system must be elevated into runtime code during development.
- **Universal links:** Native apps must be able to open a URL and navigate to the correct screen. This means that the router must be able to parse a URL and navigate to the correct screen. The router should also be able to share URL routes across platforms.

## Features

- **Automatic:** The router should be able to automatically generate a navigation tree based on the app's file system. This should be possible in both development and production.
- **Native:** The router should be able to be used with `react-native-screens` to enable native navigation primitives like `UINavigationController` on iOS and `Fragment` on Android.
- **Universal:** The router should be able to be used with `react-native-web` to enable web navigation.
- **Offline:** The router should be able to be used without a server. This means that the router must be able to run on the client in native environments. This is critical for app review.
- **Universal links:** The router should be able to automatically parse incoming URLs and navigate to the correct page. This router should also be able to share URLs across platforms, enabling **perfect hand-off** between platforms. This means App Clips, Universal Links, and Deep Links should all work out of the box.
- Missing routes are handled automatically. A default 404-type component is rendered when a route is not found. This can be fully replaced by adding a `app/[...missing].tsx` route.

## Follow up work

The following are out of scope for the initial version, but carefully considered to ensure we don't make any decisions that would make them impossible in the future (we may move some of these features into v1):

- **Scrolling:** Page scrolling and native scroll-to-top behavior should be supported in a convenient universal API.
- **Server components:** This RFC is focused on native apps. No part of the API should impede React server components, or static rendering, we should be able to implement high-performing web navigation in the future.
- **Suspense boundaries:** This feature is not currently implemented in React Native/Metro but we plan to add it to `expo/metro-config` for improved bundling in development, and bundle splitting in production.
<!-- - **Data fetching:** When pre-rendering your website, you should have the option to fetch data and use it to populate the component before rendering. React Native does not have HTML or CSS so pre-rendering is a no-op. We should be able to implement a data policy in the future when we work on refined web support. -->
- **Bundle splitting:** Unlike the web, native has the ability to ship Hermes bytecode, meaning bundle splitting would not have very drastic savings for most screens. We can implement this in the background later when web is a priority. Bundle splitting should make certain size-limited targets like App Clips (limited to 15mb) more powerful as you could dynamically load pages, but this is not a priority for v1.
- **View restoration:** The native optimization could be naively [implemented on iOS](https://developer.apple.com/documentation/uikit/view_controllers/preserving_your_app_s_ui_across_launches) and [Android](https://developer.android.com/topic/libraries/architecture/saving-states) since we will statically be able to infer where native screens are located.
- **Multiple launch screens:** iOS should technically support having a launch screen for each URL in the application. This would enable developers to have different launch screens using skeleton UIs for different parts of the app. These skeleton UIs could also be used as suspense loaders on web. Unfortunately the feature is [broken on iOS](https://twitter.com/Baconbrix/status/1537166150458654725?s=20&t=7nfvBimR99BtDOAmhmXAzw), and therefore not a priority for v1.

## More

- [Routes](routes.md)
- [Exports](exports.md)
- [FAQ](faq.md)
