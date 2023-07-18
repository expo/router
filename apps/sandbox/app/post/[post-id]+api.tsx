// import { ExpoRequest, ExpoResponse } from "expo-router/server";
// import fs from "fs";
// import path from "path";
import satori from "satori";
// import { getFont } from "../../etc/getFont";
// const svg2img = require("svg2img");

const ExpoResponse =
  global.ExpoResponse as typeof import("expo-router/server").ExpoResponse;

const SUPER_E2E_TEST_SECRET_VALUE = "SUPER_E2E_TEST_SECRET_VALUE";

/** @type {import('expo-router/server').RequestHandler} */
export async function GET(
  req: typeof import("expo-router/server").ExpoRequest
) {
  const pkg = { foo: "bar: " + __dirname };
  // JSON.parse(
  //   await fs.promises.readFile(
  //     path.join(__dirname, "../..", "package.json"),
  //     "utf8"
  //   )
  // );

  console.log("req", req.expoUrl.pathname, req.url);
  // Used for most languages
  const inter = await getFont({
    family: "Inter",
    weights: [400, 700] as const,
  });

  // Used for arabic text
  const bonaNova = await getFont({
    family: "Bona Nova",
    weights: [400, 700] as const,
  });

  // Used for chinese
  const notoSans = await getFont({
    family: "Noto Sans SC",
    weights: [400, 700] as const,
  });
  const svg = await satori(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
        fontSize: 60,
        letterSpacing: -2,
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      <svg
        width="75"
        viewBox="0 0 24 24"
        fill="#000"
        style={{ margin: "0 75px" }}
      >
        <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z" />
      </svg>
      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
          backgroundClip: "text",
          "-webkit-background-clip": "text",
          color: "transparent",
        }}
      >
        Expo Router
      </div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
          backgroundClip: "text",
          "-webkit-background-clip": "text",
          color: "transparent",
        }}
      >
        Server Routes
      </div>
      <div
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))",
          backgroundClip: "text",
          "-webkit-background-clip": "text",
          color: "transparent",
        }}
      >
        {req.expoUrl.pathname}
      </div>
    </div>,

    {
      width: 800,
      height: 400,
      fonts: [
        { name: "Inter", data: inter[400], weight: 400 },
        { name: "Inter", data: inter[700], weight: 700 },
        { name: "Noto Sans SC", data: notoSans[400], weight: 400 },
        { name: "Noto Sans SC", data: notoSans[700], weight: 700 },
        { name: "Bona Nova", data: bonaNova[400], weight: 400 },
        { name: "Bona Nova", data: bonaNova[700], weight: 700 },
      ],
    }
  );

  console.log(
    ">",
    svg,
    // pkg,
    // { __dirname, __filename },
    req.expoUrl,
    req.expoUrl.searchParams.get("post-id")
  );

  // const data = await new Promise((res) =>
  //   svg2img(svg, function (error, buffer) {
  //     res(buffer);
  //   })
  // );

  // const resvg = new Resvg(svg, {});
  // const pngData = resvg.render();
  // const pngBuffer = pngData.asPng();

  // return new ExpoResponse(data, {
  //   headers: {
  //     "Content-Type": "image/png",
  //     "cache-control": "public, max-age=31536000, immutable",
  //   },
  // });
  return new ExpoResponse(svg, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml",
    },
  });

  return ExpoResponse.json({ hey: "world", pkg, SUPER_E2E_TEST_SECRET_VALUE });
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
