import "@testing-library/jest-native/extend-expect";

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

export const initialUrlRef = {
  value: "",
  then(onfulfilled: (v: string) => string) {
    const nextValue = onfulfilled?.(this.value);
    if (nextValue !== undefined) {
      this.value = nextValue;
    }
    return this;
  },
  catch() {
    return this;
  },
};

jest.mock("expo-linking", () => {
  const module: typeof import("expo-linking") = {
    ...jest.requireActual("expo-linking"),
    createURL(path: string) {
      return "yourscheme://" + path;
    },
    resolveScheme() {
      return "yourscheme";
    },
    addEventListener() {
      return { remove() {} } as any;
    },
    getInitialURL() {
      return initialUrlRef as unknown as Promise<string>;
    },
  };

  return module;
});
