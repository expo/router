# Expo Router Preview

This is a preview of the new router for React Native apps. It is currently in alpha and is not ready for production use.
The repo also acts as an **RFC for the router**. Please open a discussion if you have any questions or feedback.

- [Router](/packages/expo-router) - Current implementation.
- [Documentation](https://expo.github.io/router) - Current documentation for the router (WIP / RFC).
- [Example](/apps/demo) - Test app.
- [RFC](https://github.com/expo/router/discussions/1) - Add your feedback here.

## Demo

> Onboarding and entry-less startup require [`@evanbacon/cli/touch-middleware`](https://github.com/expo/expo/compare/%40evanbacon/cli/touch-middleware) branch on `expo/expo` for Expo CLI features.

- Run `yarn` in the root of the repo to install dependencies.
- Run `yarn start` in the root to compile the `packages/`
- Change directory to `apps/demo` and run `yarn start` to start the demo app.
- Modify the contents of `apps/demo/app/` to use the router.

The router demo uses a custom version of Metro, this may cause conflicting version issues that lead to `require.resolve` cannot be found. If this happens, you can run `yarn` in the root of the repo and restart the dev server.

<!-- https://twitter.com/Baconbrix/status/1560353229241831425?s=20&t=oMP-INzqtw8fqrxpzLS-8Q -->
