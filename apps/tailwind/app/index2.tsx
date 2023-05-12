import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import clsx from "clsx";

const textColors = ["text-red-500", "text-pink-500", "text-teal-500"];
const bgColors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];

export default function Page() {
  let [isPartyTime, setParty] = useState(false);
  let [textColor, setTextColor] = useState(0);
  let [bgColor, setBgColor] = useState(0);

  useEffect(() => {
    if (isPartyTime) {
      const textInterval = setInterval(
        () => setTextColor((color) => ++color % textColors.length),
        300
      );
      const bgInterval = setInterval(
        () => setBgColor((color) => ++color % bgColors.length),
        750
      );
      return () => {
        clearInterval(textInterval);
        clearInterval(bgInterval);
      };
    } else {
      setTextColor(0);
    }
  }, [isPartyTime]);

  const containerClasses = clsx(
    `p-4 flex-1 items-center transition-colors duration-500 bg-white`,
    {
      [bgColors[bgColor]]: isPartyTime,
    }
  );

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
    <View className={containerClasses}>
      <View className="flex-1 max-w-4xl justify-center">
        <Text className={textClassNames}>Hello World</Text>
        <Text className="text-slate-700 text-4xl">
          The entire app was styled with Tailwind CSS and works on mobile and
          web!
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
