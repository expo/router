import {
  createNativeStackNavigator,
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";

import { withLayoutContext } from "./withLayoutContext";

const NativeStackNavigator = createNativeStackNavigator().Navigator;

export const Stack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof NativeStackNavigator,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationEventMap
>(NativeStackNavigator);

export default Stack;
