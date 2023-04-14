import { View, Text } from "react-native";

import { defaultCSSInterop } from "./native/css-interop";

Object.assign(View, { cssInterop: defaultCSSInterop });
Object.assign(Text, { cssInterop: defaultCSSInterop });
