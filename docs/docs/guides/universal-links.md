---
title: Universal Links
---

Expo Router automatically creates deep links for every page. You can promote your deep links to universal links by adding verification files to your website and native app.

Universal links require a 2-part verification process for both iOS and Android:

1. **Native app verification:** This requires some form of code signing that references the target website domain (URL).
2. **Website verification:** This requires a file to be hosted on the target website in the `/.well-known` directory.

> Universal links cannot be tested in the Expo Go app. You need to create a development build.

## Deep Linking

The only step is to add a URI scheme to your app. Add a `scheme` to your Expo config (`app.json`/`app.config.js`), this makes the app available via deep link:

```json title=app.json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

Alternatively, you can use `npx uri-scheme` to generate a URI scheme for your native app.

## iOS

Add your website URL to the iOS [associated domains entitlement](https://docs.expo.dev/versions/latest/config/app/#associateddomains) in your Expo config:

```json title=app.json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:myapp.com"]
    }
  }
}
```

Build your native app with EAS Build to ensure the entitlement is registered with Apple. You can also use the [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list) to add the entitlement manually.

Next, create a `public/.well-known/apple-app-site-association` file and add the following:

```json title=public/.well-known/apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [
      {
        // Example: "QQ57RJ5UTD.com.bacon.app"
        "appID": "{APPLE_TEAM_ID}.{BUNDLE_ID}",
        // All paths that should support redirecting
        "paths": ["*"]
      }
    ]
  }
}
```

Deploy your website to a server that supports HTTPS. See the [hosting guide for more](/docs/guides/hosting.md).

Finally, install the app on your device and open the website in Safari. You should be prompted to open the app. Expo Router will automatically redirect all web pages to the corresponding native pages.

> Apple docs: [Universal Links](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html)

## Android

Add your website URL to the Android [intent filters](https://docs.expo.dev/versions/latest/config/app/#intentfilters) in your Expo config:

```json title=app.json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": {
            "scheme": "https",
            "host": "myapp.com"
          },
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

> Alternatively you can setup intent filters [manually in the AndroidManifest.xml file](https://developer.android.com/training/app-links/verify-android-applinks#add-intent-filters).

Create a JSON file for the website verification (aka [digital asset links](https://developers.google.com/digital-asset-links/v1/getting-started) file) at `public/.well-known/assetlinks.json` and collect the following information:

- `package_name`: The Android [application ID](https://docs.expo.dev/versions/latest/config/app/#package) of your app (e.g. `com.bacon.app`). This can be found in the `app.json` file under `expo.android.package`.
- `sha256_cert_fingerprints`: The SHA256 fingerprints of your app’s signing certificate. This can be obtained in one of two ways:
  1. After building an Android app with EAS Build, run `eas credentials -p android` and select the profile you wish to obtain the fingerprint for. The fingerprint will be listed under `SHA256 Fingerprint`.
  2. by visiting the [Play Console](https://play.google.com/console/) developer account under `Release > Setup > App Integrity`; if you do, then you'll also find the correct Digital Asset Links JSON snippet for your app on the same page. The value will look like `14:6D:E9:83...`

```json title=public/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "{package_name}",
      "sha256_cert_fingerprints": [
        // Supports multiple fingerprints for different apps and keys
        "{sha256_cert_fingerprints}"
      ]
    }
  }
]
```

Installing the app will trigger the [Android app verification](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc), which can take up to 20 seconds.

All in-app redirection is handled automatically by Expo Router. You can test your universal links by opening the website in Chrome and clicking on a link. You should be prompted to open the app.

> Google docs: [App Links](https://developer.android.com/training/app-links)

## Debugging

Expo CLI enables you to test your universal links without deploying a website. Utilizing the [`--tunnel` functionality](https://docs.expo.dev/workflow/expo-cli/#tunneling), you can forward your dev server to a publicly available https URL.

1. Set the environment variable `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain` where "my-custom-domain" is a unique string that you will use during development. This will ensure that your tunnel URL is consistent across restarts.
2. Setup universal links as described above, but this time using an Ngrok URL: `my-custom-domain.ngrok.io`
3. Start your dev server with the `--tunnel` flag:

```bash
yarn expo start --tunnel
```

4. Build a development client: `yarn expo run:ios` or `yarn expo run:android`. This will install the development client on your device.

## Trouble Shooting

- Ensure your apple app site association file is valid by using a [validator tool](https://branch.io/resources/aasa-validator/).
- Ensure your website is served over HTTPS.
- The uncompressed `apple-app-site-association` file cannot be [larger than 128kb](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
- [Verify Android app links](https://developer.android.com/training/app-links/verify-android-applinks)
- Ensure both website verification files are served with `content-type` `application/json`.
- Android verification may take up to 20 seconds to take effect.
