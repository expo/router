import { render } from "@testing-library/react-native";
import React from "react";

import { createMockComponent, registerCSS } from "./utils";
import { StyleSheet } from "../runtime/native/stylesheet";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

test("translateX percentage", () => {
  registerCSS(`.my-class { width: 120px; transform: translateX(10%); }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    width: 120,
    transform: [{ translateX: 12 }],
  });
});

test("translateY percentage", () => {
  registerCSS(`.my-class { height: 120px; transform: translateY(10%); }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    height: 120,
    transform: [{ translateY: 12 }],
  });
});
