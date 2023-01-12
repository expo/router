import { buildUrlForBundle } from "../buildUrlForBundle";

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

it(`returns an expected URL with no params`, () => {
  mockOrigin("http://localhost:19000");
  expect(buildUrlForBundle("/foobar", {})).toEqual(
    "http://localhost:19000/foobar.bundle"
  );
});
it(`returns an expected URL with params`, () => {
  mockOrigin("http://localhost:19000");
  expect(buildUrlForBundle("foobar", { platform: "web" })).toEqual(
    "http://localhost:19000/foobar.bundle?platform=web"
  );
});

it(`returns an expected URL with non standard root`, () => {
  mockOrigin("http://localhost:19000");
  expect(buildUrlForBundle("/more/than/one", { happy: "meal" })).toEqual(
    "http://localhost:19000/more/than/one.bundle?happy=meal"
  );
});
