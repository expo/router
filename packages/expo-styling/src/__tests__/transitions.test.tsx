import { render } from "@testing-library/react-native";
import React from "react";
import Animated from "react-native-reanimated";

import { createMockComponent, registerCSS } from "./utils";
import { StyleSheet } from "../runtime/native/stylesheet";

const A = createMockComponent(Animated.View);

jest.useFakeTimers();

beforeEach(() => {
  StyleSheet.__reset();
});

test("basic transition", () => {
  registerCSS(`
    .transition {
      transition: width 1s;
    }

    .first {
      width: 100px;
    }

    .second {
      width: 200px;
    }
`);

  const { rerender, getByTestId } = render(
    <A testID="test" className="transition first" />
  );

  const testComponent = getByTestId("test");

  // Should have a static width, no matter the time
  expect(testComponent).toHaveAnimatedStyle({
    width: 100,
  });
  jest.advanceTimersByTime(1000);
  expect(testComponent).toHaveAnimatedStyle({
    width: 100,
  });

  rerender(<A testID="test" className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(testComponent).toHaveAnimatedStyle({
    width: 100,
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(testComponent).toHaveAnimatedStyle({
    width: 150,
  });

  // At the end of the transition
  jest.advanceTimersByTime(500);
  expect(testComponent).toHaveAnimatedStyle({
    width: 200,
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(testComponent).toHaveAnimatedStyle({
    width: 200,
  });
});
