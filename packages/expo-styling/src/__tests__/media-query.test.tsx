import { act, render } from "@testing-library/react-native";
import React from "react";

import { createMockComponent, registerCSS } from "./utils";
import { vw } from "../runtime/native/globals";
import { StyleSheet } from "../runtime/native/stylesheet";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

test("width", () => {
  registerCSS(`
.my-class { color: blue; }

@media (width: 500) {
  .my-class { color: red; }
}`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    color: "blue",
  });

  act(() => {
    vw.__set(500);
  });
});
