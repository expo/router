import {
  matchDynamicName,
  matchDeepDynamicRouteName,
  getNameFromFilePath,
  matchFragmentName,
} from "../matchers";

describe(matchFragmentName, () => {
  it(`matches`, () => {
    expect(matchFragmentName("[[...foobar]]")).toEqual(undefined);
    expect(matchFragmentName("[[foobar]]")).toEqual(undefined);
    expect(matchFragmentName("[...foobar]")).toEqual(undefined);
    expect(matchFragmentName("[foobar]")).toEqual(undefined);
    expect(matchFragmentName("(foobar)")).toEqual("foobar");
    expect(matchFragmentName("((foobar))")).toEqual("(foobar)");
    expect(matchFragmentName("(...foobar)")).toEqual("...foobar");
    expect(matchFragmentName("foobar")).toEqual(undefined);
  });
});
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

describe(getNameFromFilePath, () => {
  it(`should return the name of the file`, () => {
    expect(getNameFromFilePath("./pages/home.tsx")).toBe("pages/home");
    expect(getNameFromFilePath("../pages/home.js")).toBe("pages/home");
    expect(getNameFromFilePath("./(home).jsx")).toBe("(home)");
    expect(getNameFromFilePath("../../../(pages)/[any]/[...home].ts")).toBe(
      "(pages)/[any]/[...home]"
    );
  });
});
