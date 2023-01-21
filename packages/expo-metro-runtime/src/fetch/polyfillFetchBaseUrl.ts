// noop -- assume standard behavior.

export function wrapFetchWithBaseUrl(fetch, productionBaseUrl) {
  return fetch;
}
