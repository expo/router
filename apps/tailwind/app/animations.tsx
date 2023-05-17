import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import clsx from "clsx";

const textColors = ["text-red-500", "text-green-500", "text-blue-500"];

export default function Page() {
  let [isPartyTime, setParty] = useState(false);
  let [textColor, setTextColor] = useState(0);

  useEffect(() => {
    if (isPartyTime) {
      const textInterval = setInterval(
        () => setTextColor((color) => ++color % textColors.length),
        300
      );
      return () => clearInterval(textInterval);
    } else {
      setTextColor(0);
    }
  }, [isPartyTime]);

  const textClassNames = clsx(
    `text-black text-6xl font-bold transition-colors duration-300`,
    {
      "animate-spin ": isPartyTime,
      [textColors[textColor]]: isPartyTime,
    }
  );

  const buttonClassNames = clsx(
    "rounded-md bg-indigo-500 mt-6 self-start flex-column flex-shrink",
    {
      "animate-bounce": isPartyTime,
    }
  );

  return (
    <View className="p-4 flex-1 items-center">
      <View className="flex-1 max-w-4xl justify-center">
        <Text className={textClassNames}>Hello World</Text>
        <Pressable
          className={buttonClassNames}
          onPress={() => setParty(!isPartyTime)}
        >
          <Text className="text-white p-4">
            {isPartyTime ? "Stop the party 🛑" : "Start the party 🎉"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
