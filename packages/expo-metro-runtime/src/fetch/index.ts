import { wrapFetchWithBaseUrl } from "./polyfillFetchBaseUrl";

window.fetch = wrapFetchWithBaseUrl(window.fetch, process.env.EXPO_BASE_URL);
