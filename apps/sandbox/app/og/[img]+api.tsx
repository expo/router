import satori from "satori";
import { View, Text } from "react-native";

const ExpoResponse =
  global.ExpoResponse as typeof import("expo-router/server").ExpoResponse;

function OGImage({ pathname }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Img: [{pathname}]</Text>
    </View>
  );
}

throw new Error("basic");
/** @type {import('expo-router/server').RequestHandler} */
export async function GET(
  req: typeof import("expo-router/server").ExpoRequest
) {
  // Used for most languages
  const inter = await getFont({
    family: "Inter",
    weights: [400, 700] as const,
  });

  const svg = await satori(<OGImage pathname={req.expoUrl.pathname} />, {
    width: 800,
    height: 400,
    fonts: [
      { name: "Inter", data: inter[400], weight: 400 },
      { name: "Inter", data: inter[700], weight: 700 },
    ],
  });

  return new ExpoResponse(svg, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml",
    },
  });
}

/** https://github.com/juliusmarminge/jumr.dev/blob/main/app/og-image/get-fonts.ts */

async function getFont<TWeights extends readonly number[]>({
  family,
  weights,
  text,
}: {
  family: string;
  weights: TWeights;
  text?: string;
}): Promise<Record<TWeights[number], ArrayBuffer>> {
  const API = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights.join(
    ";"
  )}${text ? `&text=${encodeURIComponent(text)}` : ""}`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const fonts = css
    .split("@font-face {")
    .splice(1)
    .map((font) => {
      const u = font.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
      const w = font.match(/font-weight: (\d+)/);
      return u?.[1] && w?.[1] ? { url: u[1], weight: parseInt(w[1]) } : null;
    })
    .filter(
      (font): font is { url: string; weight: TWeights[number] } => !!font
    );

  const promises = fonts.map(async (font) => {
    const res = await fetch(font.url);
    return [font.weight, await res.arrayBuffer()];
  });

  // Object.fromEntries is typed as returning any *sigh*
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.fromEntries(await Promise.all(promises));
}
