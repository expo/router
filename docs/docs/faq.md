---
title: FAQ
sidebar_position: 5
---

:::note Have more questions?

Discuss them with us on [GitHub](https://github.com/expo/router/discussions).

:::

## Expo Router vs. Expo vs. React Native CLI

Expo router is akin to modern web frameworks like Next.js or Remix, whereas default Expo/React Native projects are more closely related to default React projects built with Create React App.

After this framework has been proven at scale and we have had time to collect and implement community feedback then we will consider moving this framework into the `expo` default offering. If this happens then `expo-router` will become `expo/router` and the entire process will be even easier to use.

We care deeply about performance and stability so this won't happen until we are confident that this framework is ready for the default offering.

## Can I use Expo Router in my React Native app?

Yes, all of Expo's tools and services can be used with any React Native project. The router must be used with `npx expo start` (Expo CLI) due to the advanced bundler functionality we implemented to make file based routing possible. You can run `npx expo start --port 8081` to run the dev server on the default port for React Native CLI apps.

## What are the benefits of file based routing?

1. The file system is a well-known and well-understood concept. The simpler mental model makes it easier to onboard new team members, and scale your application.
2. The fastest way to onboard new users is by having them open a universal link which opens the app or website to the correct screen depending on if they have the app installed or not. This technique is so advanced that it's usually only available to large companies that can afford to make and maintain the parity between platforms. But with Expo's file system-based routing you can have this feature out of the box!
3. Refactoring is easier to do because you can move files around without having to update any imports or routing components.
4. When using React Navigation manually, you have to define the routes and the linking config, this can be error-prone and tedious. It's also extremely difficult to validate that all of your routes work. With a file system based router, you can automatically generate the routes and linking config, and know that all of your routes **Just Work™**.
5. **Expo CLI** can infer a lot of information about your application when it follows a known convention. For example, we could implement automatic bundle splitting per route, or automatically generate a sitemap for your website. This is not possible when your app only has a single entry point.
6. Files can export settings per route, like rendering pattern, or which pages can be universally linking between web and mobile.

<!-- TODO: List React 18 features when they're implemented. -->

## Why should I use Expo Router over React Navigation?

> TL;DR: You use the `expo` router _with_ React Navigation, it's not a replacement.

Automation is not only easier but it's more reliable. Having to manually maintain the React Navigation components and the deep linking configuration is prone to errors. The Expo router turns your file system into a single source of truth for navigation and deep linking.

Expo's routing API is designed to be universal for iOS, Android, and web but our priority is to solving native development. This means there may be aspects of a web-only framework that are more optimal for web, and we recommend using the tools that best suit your needs.

## How do I server-render my Expo Router website?

This functionality is not currently offered. Web support is secondary to our native offering and serves to help test and debug the native implementation. We recommend using Next.js or Remix for server-rendered websites that compliment your native app.

## How do I use Expo Router with Next.js?

The Expo routing API is similar to Next's router but they aren't interchangeable. We recommend setting up a monorepo with a Next.js app and a React Native app. You can then export universal React Native components from the respective file paths in both projects to obtain the optimal behavior for both systems.
