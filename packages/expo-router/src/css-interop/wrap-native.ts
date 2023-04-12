import { Image, ImageBackground, Pressable, Text, View } from "react-native";

import { defaultCSSInterop } from "./css-interop";

Object.assign(Image, { cssInterop: defaultCSSInterop });
Object.assign(ImageBackground, { cssInterop: defaultCSSInterop });
Object.assign(Pressable, { cssInterop: defaultCSSInterop });
Object.assign(Text, { cssInterop: defaultCSSInterop });
Object.assign(View, { cssInterop: defaultCSSInterop });
