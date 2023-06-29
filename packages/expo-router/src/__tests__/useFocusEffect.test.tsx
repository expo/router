import React, { Text } from "react-native";

import { router, useFocusEffect } from "../exports";
import { Stack } from "../layouts/Stack";
import { act, renderRouter, screen } from "../testing-library";

it("does not re-render extraneously", () => {
  const events: string[] = [];
  renderRouter({
    _layout: () => {
      useFocusEffect(() => {
        events.push("_layout");
      });

      return <Stack />;
    },
    index: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFocusEffect(() => {
        events.push("index");
      });
      return <Text>index</Text>;
    },
    two: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFocusEffect(() => {
        events.push("two");
      });
      return <Text>two</Text>;
    },
  });

  expect(screen).toHavePathname("/");
  expect(events).toEqual(["_layout", "index"]);

  act(() => router.push("/two"));
  expect(screen).toHavePathname("/two");
  expect(events).toEqual(["_layout", "index", "two"]);
  act(() => router.push("/"));
  expect(screen).toHavePathname("/");
  expect(events).toEqual(["_layout", "index", "two", "index"]);
});

it("can navigate instantly after mounting", () => {
  const events: string[] = [];
  renderRouter({
    _layout: () => {
      useFocusEffect(() => {
        events.push("_layout");
        router.push("/two");
      });

      return <Stack />;
    },
    index: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFocusEffect(() => {
        events.push("index");
      });
      return <Text>index</Text>;
    },
    two: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFocusEffect(() => {
        events.push("two");
      });
      return <Text>two</Text>;
    },
  });

  expect(screen).toHavePathname("/two");
  expect(events).toEqual(["_layout", "two"]);
});
