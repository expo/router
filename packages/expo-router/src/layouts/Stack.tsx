import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import { withLayoutContext } from './withLayoutContext';

// This is the only way to access the navigator.
const StackNavigator = createStackNavigator().Navigator;

export const Stack = withLayoutContext<StackNavigationOptions, typeof StackNavigator>(StackNavigator);
