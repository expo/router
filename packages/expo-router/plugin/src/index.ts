import { ConfigPlugin } from "expo/config-plugins";
import validate from "schema-utils";

const schema = require("../options.json");

const withRouter: ConfigPlugin<{
  /** Production origin URL where assets in the public folder are hosted. The fetch function is polyfilled to support relative requests from this origin in production, development origin is inferred using the Expo CLI development server. */
  origin: string;
  /** A more specific origin URL used in the `expo-router/head` module for iOS handoff. Defaults to `origin`. */
  headOrigin?: string;
  /** Changes the routes directory from `app` to another value. Defaults to `app`. Avoid using this property. */
  unstable_src?: string;
  /** Should Async Routes be enabled, currently only `development` is supported. */
  asyncRoutes?: string;
}> = (config, props) => {
  validate(schema, props);

  return {
    ...config,
    extra: {
      ...config.extra,
      router: {
        ...config.extra?.router,
        ...props,
      },
    },
  };
};

export default withRouter;
