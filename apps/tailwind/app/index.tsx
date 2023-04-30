import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import clsx from "clsx";

const partyColors = [
  "text-red-500",
  "text-yellow-500",
  "text-pink-500",
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
];

export default function Page() {
  let [textColor, setTextColor] = useState(0);
  let [isPartyTime, setParty] = useState(false);

  useEffect(() => {
    if (isPartyTime) {
      const interval = setInterval(
        () => setTextColor(++textColor % partyColors.length),
        1000
      );
      return () => clearInterval(interval);
    } else {
      setTextColor(0);
    }
  }, [isPartyTime]);

  const textClassNames = clsx(`text-black text-6xl font-bold`, {
    "animate-spin transition-colors duration-1000": isPartyTime,
    [partyColors[textColor]]: isPartyTime,
  });

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
        <Text className="text-slate-700 text-4xl">
          This is the first page of your app.
        </Text>
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
