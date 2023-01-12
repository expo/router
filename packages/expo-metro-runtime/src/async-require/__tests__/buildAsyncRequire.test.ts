import { buildAsyncRequire } from "../buildAsyncRequire";
import { loadBundleAsync } from "../loadBundle";

export const asMock = <T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> => fn as jest.MockedFunction<T>;

jest.mock("../loadBundle", () => ({
  loadBundleAsync: jest.fn(async () => {}),
}));

function getMockRequire() {
  const mockRequire: any = jest.fn();
  mockRequire.importAll = jest.fn();

  return mockRequire;
}

it(`builds required object`, async () => {
  const _require = getMockRequire();
  const asyncRequire = buildAsyncRequire(_require);

  expect(asyncRequire).toBeInstanceOf(Function);
  expect(asyncRequire.addImportBundleNames).toBeInstanceOf(Function);
  expect(asyncRequire.prefetch).toBeInstanceOf(Function);
  expect(asyncRequire.resource).toBeInstanceOf(Function);
});

it(`loads the module with \`require.importAll\` if the moduleID was not registered before invocation`, async () => {
  const _require = getMockRequire();
  const asyncRequire = buildAsyncRequire(_require);

  const myModule = asyncRequire(650);
  expect(myModule).toBeUndefined();

  // Didn't call the fetch/async method
  expect(loadBundleAsync).not.toBeCalled();

  // Did call whatever this is
  expect(_require.importAll).toBeCalledWith(650);
});

it(`fetches and returns an async module`, async () => {
  const _require = getMockRequire();

  asMock(_require).mockReturnValueOnce({ foo: "bar" });

  const asyncRequire = buildAsyncRequire(_require);

  asyncRequire.addImportBundleNames({
    "2": "Two",
  });

  expect(asyncRequire).toBeInstanceOf(Function);

  const myModule = await asyncRequire(2);

  // Fetch and load the bundle into memory.
  expect(loadBundleAsync).toBeCalledWith("Two");

  // Ensure the module was required using Metro after the bundle was loaded.
  expect(_require).toBeCalledWith(2);

  // Ensure the module was returned.
  expect(myModule).toEqual({ foo: "bar" });
});
