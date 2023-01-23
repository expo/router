// Expo Router API
import { Navigator, Slot } from "./views/Layout";

export { useRouter } from "./link/useRouter";
export { usePathname, useSearchParams, useSegments } from "./LocationProvider";
export { Link, Redirect } from "./link/Link";

export { withLayoutContext } from "./layouts/withLayoutContext";
export { Navigator, Slot };

// Static rendering
export { Head } from "./head/Head";

// Expo Router Views
export { ExpoRoot } from "./views/Root";
export { Unmatched } from "./views/Unmatched";
export { ErrorBoundaryProps } from "./views/Try";
export { ErrorBoundary } from "./views/ErrorBoundary";

// Platform
export { SplashScreen } from "./views/Splash";
export * as Linking from "./link/linking";

// React Navigation
export { useNavigation } from "./useNavigation";
export { useRootNavigation, useRootNavigationState } from "./useRootNavigation";
export { useFocusEffect } from "./useFocusEffect";

// Deprecated (doesn't matter in beta)

/** @deprecated use `<Navigator />` */
export const Layout = Navigator;
/** @deprecated use `<Slot />` */
export const Children = Slot;
