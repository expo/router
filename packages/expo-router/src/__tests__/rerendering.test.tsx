import React, { Text } from "react-native";

import { Slot } from "../exports";
import { Stack } from "../layouts/Stack";
import { Tabs } from "../layouts/Tabs";
import { Redirect } from "../link/Link";
import { renderRouter, screen } from "../testing-library";

it.skip("404", async () => {
  const Index = jest.fn(() => <Redirect href="/404" />);

  renderRouter({
    index: Index,
  });

  expect(await screen.findByText("Unmatched Route")).toBeDefined();
});

it.skip("does not rerender routes", async () => {
  const Index = jest.fn(() => <Text>Screen</Text>);

  renderRouter({
    index: Index,
  });

  expect(await screen.findByText("Screen")).toBeDefined();
  expect(Index).toHaveBeenCalledTimes(1);
});

it.skip("redirects", async () => {
  const Index = jest.fn(() => <Redirect href="/other" />);
  const Other = jest.fn(() => <Text>Other</Text>);

  renderRouter({
    "(app)/index": Index,
    "(app)/other": Other,
  });

  expect(await screen.findByText("Other")).toBeDefined();
  expect(Index).toHaveBeenCalledTimes(1);
  expect(Other).toHaveBeenCalledTimes(1);
});

it.skip("layouts", async () => {
  const Layout = jest.fn(() => <Slot />);
  const Index = jest.fn(() => <Redirect href="/other" />);
  const Other = jest.fn(() => <Text>Other</Text>);

  renderRouter({
    "(app)/_layout": Layout,
    "(app)/index": Index,
    "(app)/other": Other,
  });

  expect(await screen.findByText("Other")).toBeDefined();
  expect(Layout).toHaveBeenCalledTimes(2);
  expect(Index).toHaveBeenCalledTimes(1);
  expect(Other).toHaveBeenCalledTimes(1);
});

it.skip("nested layouts", async () => {
  const RootLayout = jest.fn(() => <Slot />);
  const AppLayout = jest.fn(() => <Slot />);
  const TabsLayout = jest.fn(() => <Tabs />);
  const StackLayout = jest.fn(() => <Stack />);

  const Index = jest.fn(() => <Redirect href="/home" />);
  const Home = jest.fn(() => <Redirect href="/home/nested" />);
  const HomeNested = jest.fn(() => <Text>HomeNested</Text>);

  renderRouter({
    "./_layout": RootLayout,
    "(app)/_layout": AppLayout,
    "(app)/index": Index,
    "(app)/(tabs)/_layout": TabsLayout,
    "(app)/(tabs)/home/_layout": StackLayout,
    "(app)/(tabs)/home/index": Home,
    "(app)/(tabs)/home/nested": HomeNested,
  });

  expect(await screen.findByText("HomeNested")).toBeDefined();

  // We navigation within the app 3 times
  expect(AppLayout).toHaveBeenCalledTimes(3);

  // We navigate within the tabs twice
  expect(TabsLayout).toHaveBeenCalledTimes(2);
  // We navigate within the stack twice
  expect(StackLayout).toHaveBeenCalledTimes(2);

  // Each page is only rendered once
  expect(Index).toHaveBeenCalledTimes(1);
  expect(Home).toHaveBeenCalledTimes(1);
  expect(HomeNested).toHaveBeenCalledTimes(1);
});
