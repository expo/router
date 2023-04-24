---
title: Custom
sidebar_position: 5
---

Expo Route supports custom navigators.

For instructions on how to build your own custom Navigator, see the [Custom navigators](https://reactnavigation.org/docs/custom-navigators).

## example

in this example, we will be using the `stack` navigator from `react navigation`, but any `navigator` will do.

simply wrap your `navigator` in `withlayoutcontext` and use it within a `_layout` file.

```tsx title=./customstack.tsx
import {
  // import the creation function
  createstacknavigator,
  // import the types
  stacknavigationoptions,
} from "@react-navigation/stack";

import { withlayoutcontext } from "expo-router";

const { navigator } = createstacknavigator();

// this can be used like `<customstack />`
export const customstack = withlayoutcontext<
  stacknavigationoptions,
  typeof navigator
>(navigator);
```

## usage

```tsx title=app/_layout.js
import { customstack } from "../customstack";

export default function rootlayout() {
  return <customstack />;
}
```
