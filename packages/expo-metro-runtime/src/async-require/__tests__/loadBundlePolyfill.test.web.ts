import HMRClient from "../../HMRClient";
import LoadingView from "../../LoadingView";
import { fetchThenEvalAsync } from "../fetchThenEval";
import { loadBundleAsync } from "../loadBundlePolyfill";

const originalLocation = location;

function mockOrigin(value: string) {
  Object.defineProperty(global, "location", {
    value: {
      origin: value,
    },
  });
}

afterAll(() => {
  location = originalLocation;
});

jest.mock("../../getDevServer", () =>
  jest.fn(() => ({
    bundleLoadedFromServer: true,
    fullBundleUrl:
      "http://localhost:19000?platform=android&modulesOnly=true&runModule=false&runtimeBytecodeVersion=null",
    url: "http://localhost:19000/",
  }))
);

jest.mock("../fetchThenEval", () => ({
  fetchThenEvalAsync: jest.fn(async () => {}),
}));

jest.mock("../../HMRClient", () => ({ registerBundle: jest.fn() }));
jest.mock("../../LoadingView", () => ({
  showMessage: jest.fn(),
  hide: jest.fn(),
}));

it("loads a bundle", async () => {
  mockOrigin("http://localhost:19000");
  await loadBundleAsync("Second");
  expect(LoadingView.showMessage).toBeCalledWith("Downloading...", "load");
  expect(LoadingView.hide).toBeCalledWith();
  const url = `http://localhost:19000/Second.bundle?modulesOnly=true&runModule=false&platform=web&runtimeBytecodeVersion=`;
  expect(HMRClient.registerBundle).toBeCalledWith(url);
  expect(fetchThenEvalAsync).toBeCalledWith(url);
});
