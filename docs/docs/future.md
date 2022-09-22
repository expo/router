---
title: Future work
sidebar_position: 6
---

The following are out of scope for the initial version, but carefully considered to ensure we don't make any decisions that would make them impossible in the future (we may move some of these features into v1):

- **Scrolling:** Page scrolling and native scroll-to-top behavior should be supported in a convenient universal API.
- **Suspense boundaries:** This feature is not currently implemented in React Native/Metro but we plan to add it to `expo/metro-config` for improved bundling in development, and bundle splitting in production.
<!-- - **Data fetching:** When pre-rendering your website, you should have the option to fetch data and use it to populate the component before rendering. React Native does not have HTML or CSS so pre-rendering is a no-op. We should be able to implement a data policy in the future when we work on refined web support. -->
- **Bundle splitting:** Unlike the web, native has the ability to ship Hermes bytecode, meaning bundle splitting would not have very drastic savings for most screens. We can implement this in the background later when web is a priority. Bundle splitting should make certain size-limited targets like App Clips (limited to 15mb) more powerful as you could dynamically load pages, but this is not a priority for v1.
- **View restoration:** The native optimization could be naively [implemented on iOS](https://developer.apple.com/documentation/uikit/view_controllers/preserving_your_app_s_ui_across_launches) and [Android](https://developer.android.com/topic/libraries/architecture/saving-states) since we will statically be able to infer where native screens are located.
- **Multiple launch screens:** iOS should technically support having a launch screen for each URL in the application. This would enable developers to have different launch screens using skeleton UIs for different parts of the app. These skeleton UIs could also be used as suspense loaders on web. Unfortunately the feature is [broken on iOS](https://twitter.com/Baconbrix/status/1537166150458654725?s=20&t=7nfvBimR99BtDOAmhmXAzw), and therefore not a priority for v1.
- **Server components:** This RFC is focused on native apps. No part of the API should impede React server components, or static rendering, we should be able to implement high-performing web navigation in the future but our priority is to native development.
