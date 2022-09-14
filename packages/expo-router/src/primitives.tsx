
import { createNavigatorFactory } from '@react-navigation/core';

// `@react-navigation/core` does not expose the Screen or Group components directly, so we have to
// do this hack.
const fake = createNavigatorFactory({} as any)();

export const Screen = fake.Screen;

export const Group = fake.Group;