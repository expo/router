import { matchDynamicName, matchDeepDynamicRouteName } from "../matchers";

describe(matchDynamicName, () => {
  it(`matches`, () => {
    expect(matchDynamicName("[[...foobar]]")).toEqual(undefined);
    expect(matchDynamicName("[[foobar]]")).toEqual(undefined);
    expect(matchDynamicName("[...foobar]")).toEqual(undefined);
    expect(matchDynamicName("[foobar]")).toEqual("foobar");
    expect(matchDynamicName("foobar")).toEqual(undefined);
  });
});

describe(matchDeepDynamicRouteName, () => {
  it(`matches`, () => {
    expect(matchDeepDynamicRouteName("[[...foobar]]")).toEqual(undefined);
    expect(matchDeepDynamicRouteName("[[foobar]]")).toEqual(undefined);
    expect(matchDeepDynamicRouteName("[...foobar]")).toEqual("foobar");
    expect(matchDeepDynamicRouteName("[foobar]")).toEqual(undefined);
    expect(matchDeepDynamicRouteName("foobar")).toEqual(undefined);
  });
});
