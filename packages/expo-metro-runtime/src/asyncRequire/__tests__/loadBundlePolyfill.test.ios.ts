import HMRClient from "../../HMRClient";
import LoadingView from "../../LoadingView";
import { fetchThenEvalAsync } from "../fetchThenEval";
import { loadBundleAsync } from "../loadBundlePolyfill";

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

// Android uses a native impl

it("loads a bundle", async () => {
  await loadBundleAsync("Second");
  expect(LoadingView.showMessage).toBeCalledWith("Downloading...", "load");
  expect(LoadingView.hide).toBeCalledWith();
  const url =
    "http://localhost:19000/Second.bundle?platform=ios&modulesOnly=true&runModule=false&runtimeBytecodeVersion=";
  expect(HMRClient.registerBundle).toBeCalledWith(url);
  expect(fetchThenEvalAsync).toBeCalledWith(url);
});
