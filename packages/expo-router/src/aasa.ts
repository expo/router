import Constants from "expo-constants";

function getWebUrlsFromManifest() {
  // TODO: Replace this with the source of truth native manifest
  // Then do a check to warn the user if the config doesn't match the native manifest.
  // TODO: Warn if the applinks have `https://` in them.
  const domains = Constants.expoConfig?.ios?.associatedDomains || [];
  // [applinks:explore-api.netlify.app/] -> [explore-api.netlify.app]
  const applinks = domains
    .filter((domain) => domain.startsWith("applinks:"))
    .map((domain) => {
      let clean = domain.replace(/^applinks:/, "");
      return clean.endsWith("/") ? clean.slice(0, -1) : clean;
    });

  return applinks;
}

export function getAllWebRedirects(
  protocols = ["https", "http"],
  subdomains = ["*"]
) {
  const urls = getWebUrlsFromManifest();
  const _subdomains = [""].concat(subdomains);
  return urls
    .map((url) =>
      protocols
        .map((protocol) =>
          _subdomains.map(
            (subdomain) =>
              `${protocol}://${[subdomain, url].filter(Boolean).join(".")}/`
          )
        )
        .flat()
    )
    .flat();
}
