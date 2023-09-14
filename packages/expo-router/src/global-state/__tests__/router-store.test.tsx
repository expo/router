import { renderHook } from "../../../testing-library";
import { RequireContext } from "../../types";
import { useInitializeExpoRouter } from "../hooks";
import { RouterStore, store as routerStore } from "../router-store";

jest.mock("../router-store", () => ({
  ...jest.requireActual("../router-store"),
  store: {
    ...jest.requireActual("../router-store").store,
    initialize: jest.fn(),
    subscribeToStore: jest.fn(),
  },
}));

describe("useInitializeExpoRouter", () => {
  let store: RouterStore;

  const location = new URL("http://example.com");
  const context: RequireContext = (id) => id;
  context.keys = () => [1, 2, 3].map((s) => `${s}`);
  context.resolve = () => "1";
  context.id = "1";

  beforeEach(async () => {
    store = routerStore;
    jest.clearAllMocks();
  });

  it("should call store.initialize when ref and context change", () => {
    const { rerender } = renderHook(
      (props) => useInitializeExpoRouter(...props),
      { initialProps: [context, location] as const }
    );

    expect(store.initialize).toHaveBeenCalledWith(
      context,
      expect.anything(),
      location
    );
    expect(store.subscribeToStore).toHaveBeenCalledTimes(1);

    const newContext: RequireContext = (id) => id;
    newContext.keys = () => [1, 2, 3].map((s) => `${s}_new`);
    newContext.resolve = () => "2";
    newContext.id = "2";
    const newLocation = new URL("http://example.com/new");

    rerender([newContext, newLocation]);
    expect(store.initialize).toHaveBeenCalledWith(
      newContext,
      expect.anything(),
      newLocation
    );
  });

  it("should not call store.initialize when the same context is passed", () => {
    const { rerender } = renderHook(
      (props) => useInitializeExpoRouter(...props),
      { initialProps: [context, location] as const }
    );
    expect(store.initialize).toHaveBeenCalledTimes(1);

    rerender([context, location]);
    expect(store.initialize).toHaveBeenCalledTimes(1);
  });
});
