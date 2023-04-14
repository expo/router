import { act, render } from "@testing-library/react-native";
import React from "react";

import { createMockComponent, registerCSS } from "./utils";
import { vh, vw } from "../runtime/native/globals";
import { StyleSheet } from "../runtime/native/stylesheet";

const A = createMockComponent();

afterEach(() => {
  StyleSheet.__reset();
});

test("px", () => {
  registerCSS(`.my-class { width: 10px; }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    width: 10,
  });
});

test("%", () => {
  registerCSS(`.my-class { width: 10%; }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    width: "10%",
  });
});

test("vw", () => {
  registerCSS(`.my-class { width: 10vw; }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    width: 75,
  });

  act(() => {
    vw.__set(100);
  });

  expect(A).styleToEqual({
    width: 10,
  });
});

test("vh", () => {
  registerCSS(`.my-class { height: 10vh; }`);

  render(<A className="my-class" />);

  expect(A).styleToEqual({
    height: 133.4,
  });

  act(() => {
    vh.__set(100);
  });

  expect(A).styleToEqual({
    height: 10,
  });
});
