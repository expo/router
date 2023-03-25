// import { Image } from "expo-image";

import Image from "@/components/img";
import React, { useMemo } from "react";
import { A } from "@expo/html-elements";

export default function App() {
  return (
    <div>
      <A href="#" title="123">
        <Image
          alt="BATMAN"
          source={"/expo.svg"}
          style={{ width: 64, height: 64 }}
        />
      </A>
      <span>Hey</span>
    </div>
  );
}
