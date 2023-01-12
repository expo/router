// Basically `__webpack_require__.l`.
export function fetchThenEvalAsync(
  url: string,
  {
    scriptType,
    nonce,
    crossOrigin,
  }: { scriptType?: string; nonce?: string; crossOrigin?: string } = {}
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    if (scriptType) script.type = scriptType;
    if (nonce) script.setAttribute("nonce", nonce);
    // script.setAttribute('data-expo-metro', ...);
    script.src = url;

    if (crossOrigin && script.src.indexOf(window.location.origin + "/") !== 0) {
      script.crossOrigin = crossOrigin;
    }

    script.onload = () => {
      script.parentNode && script.parentNode.removeChild(script);
      resolve();
    };

    script.onerror = (error) => {
      script.parentNode && script.parentNode.removeChild(script);
      reject(error);
    };
    document.head.appendChild(script);
  });
}
