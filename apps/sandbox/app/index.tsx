import { Link, Redirect } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { lists } from "../etc/data";

export default function Home() {
  return <Redirect href="/root" />;
}
