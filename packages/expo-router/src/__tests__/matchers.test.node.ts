import {
  matchDynamicName,
  matchCatchAllRouteName,
  matchOptionalCatchAllRouteName,
} from "../matchers";

describe(matchDynamicName, () => {
  it(`matches`, () => {
    expect(matchDynamicName("[[...foobar]]")).toEqual(undefined);
    expect(matchDynamicName("[[foobar]]")).toEqual(undefined);
    expect(matchDynamicName("[...foobar]")).toEqual(undefined);
    expect(matchDynamicName("[foobar]")).toEqual("foobar");
    expect(matchDynamicName("foobar")).toEqual(undefined);
  });
});

describe(matchOptionalCatchAllRouteName, () => {
  it(`matches`, () => {
    expect(matchOptionalCatchAllRouteName("[[...foobar]]")).toEqual("foobar");
    expect(matchOptionalCatchAllRouteName("[[foobar]]")).toEqual(undefined);
    expect(matchOptionalCatchAllRouteName("[...foobar]")).toEqual(undefined);
    expect(matchOptionalCatchAllRouteName("[foobar]")).toEqual(undefined);
    expect(matchOptionalCatchAllRouteName("foobar")).toEqual(undefined);
  });
});

describe(matchCatchAllRouteName, () => {
  it(`matches`, () => {
    expect(matchCatchAllRouteName("[[...foobar]]")).toEqual(undefined);
    expect(matchCatchAllRouteName("[[foobar]]")).toEqual(undefined);
    expect(matchCatchAllRouteName("[...foobar]")).toEqual("foobar");
    expect(matchCatchAllRouteName("[foobar]")).toEqual(undefined);
    expect(matchCatchAllRouteName("foobar")).toEqual(undefined);
  });
});
