export default function ExpoRouterRoot(): React.ReactElement;

export function getManifest(): {
  initialRouteName?: string | undefined;
  screens: Record<string, Screen>;
} | null;
