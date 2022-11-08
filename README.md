# Expo Router Preview

This is a preview of the new router for React Native apps. It is currently in beta and is not ready for production use.
The repo also acts as an **RFC for the router**. Please open a discussion if you have any questions or feedback.

- [Router](/packages/expo-router) - Current implementation.
- [Documentation](https://expo.github.io/router) - Current documentation for the router (WIP / RFC).
- [Example](/apps/demo) - Test app.
- [RFC](https://github.com/expo/router/discussions/1) - Add your feedback here.

## Running

The easiest way to try **Expo Router** is by creating a new project:

```
npx create-react-native-app -t with-router
```

## Contributing

If you want to work against the latest branch for contributions, you can use `apps/demo`.

> `apps/demo` is a basic playground for developing the Expo Router package, please don't open PRs specifically to improve the tester.

- Run `yarn` in the root of the repo to install dependencies.
- Run `yarn start` in the root to compile the `packages/`
- Change directory to `apps/demo` and run `yarn start` to start the demo app.
- Modify the contents of `apps/demo/app/` to use the router.

The router demo uses a custom version of Metro, this may cause conflicting version issues that lead to `require.resolve` cannot be found. If this happens, you can run `yarn` in the root of the repo and restart the dev server.

<!-- https://twitter.com/Baconbrix/status/1560353229241831425?s=20&t=oMP-INzqtw8fqrxpzLS-8Q -->
