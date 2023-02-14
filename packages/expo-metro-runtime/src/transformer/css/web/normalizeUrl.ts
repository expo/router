import { unescape } from "./unescape";

const NATIVE_WIN32_PATH = /^[A-Z]:[/\\]|^\\\\/i;

function fixedEncodeURIComponent(str) {
  return str.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
}

function isDataUrl(url) {
  if (/^data:/i.test(url)) {
    return true;
  }

  return false;
}

export function normalizeUrl(url, isStringValue) {
  let normalizedUrl = url
    .replace(/^( |\t\n|\r\n|\r|\f)*/g, "")
    .replace(/( |\t\n|\r\n|\r|\f)*$/g, "");

  if (isStringValue && /\\(\n|\r\n|\r|\f)/.test(normalizedUrl)) {
    normalizedUrl = normalizedUrl.replace(/\\(\n|\r\n|\r|\f)/g, "");
  }

  if (NATIVE_WIN32_PATH.test(url)) {
    try {
      normalizedUrl = decodeURI(normalizedUrl);
    } catch (error) {
      // Ignore
    }

    return normalizedUrl;
  }

  normalizedUrl = unescape(normalizedUrl);

  if (isDataUrl(url)) {
    // Todo fixedEncodeURIComponent is workaround. Webpack resolver shouldn't handle "!" in dataURL
    return fixedEncodeURIComponent(normalizedUrl);
  }

  try {
    normalizedUrl = decodeURI(normalizedUrl);
  } catch (error) {
    // Ignore
  }

  return normalizedUrl;
}
