import Constants from "expo-constants";

function getUrlFromConstants(): string | null {
  // This will require a rebuild in bare-workflow to update.
  const manifest =
    Constants.expoConfig || Constants.manifest2 || Constants.manifest;

  const origin =
    // @ts-expect-error
    manifest?.extra?.router?.headOrigin ?? manifest?.extra?.router?.origin;

  if (!origin) {
    throwOrAlert(
      'Expo Head: Add the handoff origin to the native manifest under "extra.router.headOrigin".'
    );
    // Fallback value that shouldn't be used for real.
    return "https://github.com";
  }

  if (!/^https?:\/\//.test(origin)) {
    throwOrAlert('Expo Head: Web URL must start with "http://" or "https://".');
  }

  return origin.replace(/\/$/, "");
}

function throwOrAlert(msg: string) {
  // Production apps fatally crash which is often not helpful.
  if (
    // @ts-ignore: process is defined
    process.env.NODE_ENV === "production"
  ) {
    console.error(msg);
    alert(msg);
  } else {
    throw new Error(msg);
  }
}

export function getStaticUrlFromExpoRouter(pathname: string) {
  // const host = "https://expo.io";
  // Append the URL we'd find in context
  return getUrlFromConstants() + pathname;
}
