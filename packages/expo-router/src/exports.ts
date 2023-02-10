// Expo Router API
import { Navigator, Slot } from "./views/Navigator";

export { useRouter } from "./link/useRouter";
export {
  usePathname,
  useLocalSearchParams,
  useSearchParams,
  useSegments,
} from "./LocationProvider";
export { Link, Redirect } from "./link/Link";

export { withLayoutContext } from "./layouts/withLayoutContext";
export { Navigator, Slot };

// Expo Router Views
export { ExpoRoot } from "./ExpoRoot";
export { Unmatched } from "./views/Unmatched";
export { ErrorBoundaryProps } from "./views/Try";
export { ErrorBoundary } from "./views/ErrorBoundary";

// Platform
export { SplashScreen } from "./views/Splash";

// React Navigation
export { useNavigation } from "./useNavigation";
export { useRootNavigation, useRootNavigationState } from "./useRootNavigation";
export { useFocusEffect } from "./useFocusEffect";
