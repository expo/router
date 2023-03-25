import {
  transformCssModuleNative,
  convertLightningCssToReactNativeWebStyleSheet,
  transformCssModuleWeb,
} from "../css-modules";

const fixtureA = `
:root {
    --accent-color: hotpink;
}

.container {
    background-color: var(--accent-color);
    animation: pulse 2s infinite;
}

.betterContainer {
    composes: container;
    border-radius: 50px;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
`;

describe(convertLightningCssToReactNativeWebStyleSheet, () => {
  it(`transforms A`, () => {
    expect(
      convertLightningCssToReactNativeWebStyleSheet({
        pulse: { name: "a3Dm-a_pulse", composes: [], isReferenced: true },
        betterContainer: {
          name: "a3Dm-a_betterContainer",
          composes: [{ type: "local", name: "a3Dm-a_container" }],
          isReferenced: false,
        },
        "--accent-color": {
          name: "--a3Dm-a_accent-color",
          composes: [],
          isReferenced: true,
        },
        container: {
          name: "a3Dm-a_container",
          composes: [],
          isReferenced: false,
        },
      })
    ).toEqual({
      "--accent-color": { $$css: true, c: "--a3Dm-a_accent-color" },
      betterContainer: {
        $$css: true,
        c: "a3Dm-a_betterContainer a3Dm-a_container",
      },
      container: { $$css: true, c: "a3Dm-a_container" },
      pulse: { $$css: true, c: "a3Dm-a_pulse" },
    });
  });
});

describe(transformCssModuleWeb, () => {
  it(`transforms A`, async () => {
    const { src } = await transformCssModuleWeb({
      filename: "acme.css",
      src: fixtureA,
      options: {
        projectRoot: "/",
        minify: false,
      },
    } as any);
    expect(src).toMatch(/import { StyleSheet } from 'react-native';/);
    expect(src).toMatch(/export default StyleSheet\.create/);
  });
});

describe(transformCssModuleNative, () => {
  it(`transforms A`, async () => {
    const { src } = await transformCssModuleNative({
      filename: "acme.css",
      src: fixtureA,
      options: {
        projectRoot: "/",
        minify: false,
      },
    } as any);
    expect(src).toMatchSnapshot();
  });
});
