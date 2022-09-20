import { getNameFromFilePath } from "../routes";

describe(getNameFromFilePath, () => {
  it(`should return the name of the file`, () => {
    expect(getNameFromFilePath("./pages/home.tsx")).toBe("pages/home");
  });
});
