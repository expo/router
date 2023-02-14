import { fileURLToPath } from "url";

// We can't use path.win32.isAbsolute because it also matches paths starting with a forward slash
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
const IS_MODULE_REQUEST = /^[^?]*~/;

function urlToRequest(url: string, root?: string) {
  let request;

  if (IS_NATIVE_WIN32_PATH.test(url)) {
    // absolute windows path, keep it
    request = url;
  } else if (typeof root !== "undefined" && /^\//.test(url)) {
    request = root + url;
  } else if (/^\.\.?\//.test(url)) {
    // A relative url stays
    request = url;
  } else {
    // every other url is threaded like a relative url
    request = `./${url}`;
  }

  // A `~` makes the url an module
  if (IS_MODULE_REQUEST.test(request)) {
    request = request.replace(IS_MODULE_REQUEST, "");
  }

  return request;
}

export function requestify(url, rootContext, needToResolveURL = true) {
  if (needToResolveURL) {
    if (/^file:/i.test(url)) {
      return fileURLToPath(url);
    }

    return url.charAt(0) === "/"
      ? urlToRequest(url, rootContext)
      : urlToRequest(url);
  }

  if (url.charAt(0) === "/" || /^file:/i.test(url)) {
    return url;
  }

  // A `~` makes the url an module
  if (IS_MODULE_REQUEST.test(url)) {
    return url.replace(IS_MODULE_REQUEST, "");
  }

  return url;
}
