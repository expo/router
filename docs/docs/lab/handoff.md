---
title: Handoff
---

> This guide refers to upcoming Expo Router features, all of which are experimental.

Handoff is a feature that enables users to continue browsing your app or website on another device. This functionality is generally very useful for users, but it can be difficult to implement. Expo Router streamlines a lot of the complexity of handoff by providing a simple API.

In Expo Router, the underlying iOS API (`NSUserActivity`) requires a `webpageUrl` which the OS recommends as the current URL for switching to your app. The `expo-router/head` component has a native module which can be used to automatically set the `webpageUrl` to the current URL.

## Setup

The following restrictions and considerations are very important:

- Handoff is Apple-only.
- Handoff can not be used in the Expo Go app as it requires build-time configuration.
- Handoff requires [universal links](/docs/guides/universal-links) to be configured.
- Handoff requires the `expo-router/head` component to be used on each page that you want to support.

Ensure your `public/.well-known/apple-app-site-association` file is configured correctly. It must contain the `activitycontinuation` key with the `apps` array containing your app's bundle ID and Team ID formatted as `<TEAM ID>.<BUNDLE ID>`.

```json title=public/.well-known/apple-app-site-association
{
  "applinks": {
    "details": [
      {
        "appIDs": ["QQ57RJ5UTD.app.expo.router.sandbox"],
        "components": [
          {
            "/": "*",
            "comment": "Matches all routes"
          }
        ]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["QQ57RJ5UTD.app.expo.router.sandbox"]
  }
}
```

The associated domains must be configured and signed, even in development. You can use the `EXPO_TUNNEL_SUBDOMAIN` environment variable to configure the subdomain for your development tunnel. The tunnel is required for testing in development because you need SSL to use universal links, Expo CLI provides built-in support for this by running `npx expo start --tunnel`.

> The environment variable `EXPO_TUNNEL_SUBDOMAIN` must be unique as any user can be using the subdomain at any time. You can use a random string or your GitHub username. However, the URL must match what is in your native `ios/<project>/<project>.entitlements` file under the `com.apple.developer.associated-domains` key.

Ensure you set the Handoff origin in your `app.config.js` file. This is the URL that will be used for the `webpageUrl` when the user switches to your app.

```js title=app.config.js
// Be sure to change this to be unique to your project.
process.env.EXPO_TUNNEL_SUBDOMAIN = "bacon-router-sandbox";

const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  // ...
  ios: {
    bundleIdentifier: "...",
    associatedDomains: [
      // highlight-next-line
      `applinks:${ngrokUrl}`,
      // highlight-next-line
      `activitycontinuation:${ngrokUrl}`,

      // Add additional production-URLs here.
      // `applinks:example.com`,
      // `activitycontinuation:example.com`,
    ],
  },

  plugins: [
    [
      "expo-router",
      {
        // highlight-next-line
        headOrigin:
          process.env.NODE_ENV === "development"
            ? `https://${ngrokUrl}`
            : "https://my-website-example.com",
      },
    ],
  ],
};
```

> Do not use the development-only `?mode=developer` suffix when testing handoff to native.

After you've configured the Expo Config, sync the changes with your native build `npx expo prebuild -p ios`.

Now you must start the website BEFORE installing the app on your device, this is because when you install the app, the OS will trigger Apple's servers to ping your website for the `.well-known/apple-app-site-association` file. If the website is not running, the OS will not be able to find the file and handoff will not work. If this happens, simply rebuild the native app with `npx expo run:ios -d`.

## Usage

In any route that you want to support handoff, you must use the `expo-router/head` component.

```tsx title=app/index.tsx
import Head from "expo-router/head";
import { Text } from "react-native";

export default function App() {
  return (
    <>
      <Head>
        // highlight-next-line
        <meta property="expo:handoff" content="true" />
      </Head>
      <Text>Hello World</Text>
    </>
  );
}
```

### Meta Tags

The `expo-router/head` component supports the following meta tags:

- `expo:handoff` - Set to `true` to enable handoff for the current route. iOS-only. Defaults to `false`.
- `expo:spotlight` - Set to `true` to enable spotlight search for the current route. iOS-only. Defaults to `false`.
- `og:url` - Set the URL that should be opened when the user switches to your app. Defaults to the current URL in-app with `headOrigin` prop in the `expo-router` Config Plugin, as the baseURL. Passing a relative path will append the `headOrigin` to the path.
- `og:title` and `<title>` - Set the title for the `NSUserActivity` this is unused with handoff.
- `og:description` - Set the description for the `NSUserActivity` this is unused with handoff.

You may want to switch the values between platforms, for that you can use `Platform.select`:

```tsx title=app/index.tsx
import Head from "expo-router/head";

export default function App() {
  return (
    <>
      <Head>
        <meta
          property="og:url"
          // highlight-next-line
          content={Platform.select({ web: "https://expo.dev", default: null })}
        />
      </Head>
    </>
  );
}
```

## Testing

> Ensure your Apple devices have Handoff enabled: [Enabling Handoff](https://support.apple.com/en-us/HT209455). You can test this by following the steps below, but substituting your app with Safari.

1. Open your native application on your device.
2. Navigate to a route in the app that supports handoff, i.e. is rendering the `<Head />` element from Expo Router.
3. To switch to your Mac, click the app's Handoff icon in the Dock.

![Apple Handoff from Apple device to Mac computer](/handoff/macos-handoff.png)

4. To switch to your iPhone or iPad, open the App Switcher, as you would when switching between apps, then tap the app banner at the bottom of the screen.

![Apple Handoff from Apple device to iPhone in the App Switcher](/handoff/iphone-handoff.png)

> If you only see the Safari icon in your iPhone's App Switcher, then handoff is not working. Follow the [Trouble Shooting](#trouble-shooting) section below.

## Trouble Shooting

You can test the Apple App Site Association file (`public/.well-known/apple-app-site-association`) by using a validator like this one: [AASA Validator](https://branch.io/resources/aasa-validator/).

If you're having issues, the best thing you can do is enable the most aggressive handoff settings in your app, this will ensure that any possible route is linkable. You can do this like so:

Ensure your `public/.well-known/apple-app-site-association` file matches all routes:

```json title=public/.well-known/apple-app-site-association
{
  "applinks": {
    "details": [
      {
        "appIDs": ["QQ57RJ5UTD.app.expo.router.sandbox"],
        "components": [
          {
            // highlight-next-line
            "/": "*",
            // highlight-next-line
            "comment": "Matches all routes"
          }
        ]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["QQ57RJ5UTD.app.expo.router.sandbox"]
  }
}
```

In the application, ensure you are not rendering the `<Head />` element conditionally (e.g. in an if/else block), it must be rendered on every page that you want to support handoff. We recommend adding it to the [Root Layout](/docs/guides/root-layout) component to ensure every route is linkable while debugging.

<!--
```json title=app.json
{
  "expo": {
    "ios": {
      "associatedDomains": [
        "applinks:*.ngrok.io",
        "activitycontinuation:*.ngrok.io"
      ]
    }
  }
}
``` -->

The URL should be something like: `https://bacon-router-sandbox.ngrok.io/.well-known/apple-app-site-association`

Ensure you can access the Ngrok URL (via the browser for example), before building (installing) the app on your device. If you can't access the URL, the OS will not be able to find the file and handoff will not work.

`npx expo run:ios` and Xcode will both codesign your app when associated domains is setup, this is required for handoff and universal links to work.

Handoff between your Mac and iPhone/iPad is not supported in the Expo Go app. You must build and install your app on your device.

If you see the Safari icon in the App Switcher on your iPhone, then it means handoff is not working. Ensure you are not using the `?mode=developer` suffix when testing handoff to native. Also be sure you're not using the local development server URL, e.g. `http://localhost:8081` as this cannot be used as a valid app site association link, open the running Ngrok URL in your browser to test.

Ensure your `public/.well-known/apple-app-site-association` file contains the `activitycontinuation` field.

Your `public/.well-known/apple-app-site-association` must be served from a secure URL (HTTPS). If you are using a development tunnel, you must use the `EXPO_TUNNEL_SUBDOMAIN` environment variable to configure the subdomain for your development tunnel. The tunnel is required for testing in development because you need SSL to use universal links, Expo CLI provides built-in support for this by running `npx expo start --tunnel`.

Check your `ios/<project>/<project>.entitlements` file, under the `com.apple.developer.associated-domains` key. This should contain the same domains as your web server / website. The URL should be not contain a protocol (`https://`) or additional pathname, query parameters, or fragments.

### Still Stuck?

> This is an important but very difficult feature to setup. Expo Router automates many of the moving parts, Expo CLI automates much of the configuration and hosting, but hardware settings can still be misconfigured!

If all else fails, you can try to debug the issue by following the steps in the [Apple Docs][apple-docs-handoff]. Note that:

- "Representing user activities as instances of `NSUserActivity`." is performed by the Expo Head native module.
- "Updating the activity instances as the user performs actions in your app." is performed by mounting/rendering the `<Head />` component with the meta tag `<meta property="expo:handoff" content="true" />` inside.
- "Receiving activities from Handoff in your app on other devices." is performed by an [App Delegate Subscriber](https://docs.expo.dev/modules/appdelegate-subscribers/) in the Expo Head native module. It is used to redirect you to the correct route when you handoff to your native app.

[apple-docs-handoff]: https://developer.apple.com/documentation/foundation/task_management/implementing_handoff_in_your_app

## Known Issues

- Handoff from web (Chrome) to native, does not appear to support Client-side Routing. This means the URL presented in the App Switcher will be the URL of the page you were on when you clicked the link, or reloaded the page. This appears to be a limitation of the web platform, and not something that can be fixed by Expo Router.
