import { View, Text } from "react-native";
import { usePathname } from "expo-router";

export default function Page() {
  const pathname = usePathname();
  return (
    <View
      style={{
        flex: 1,
        // pretty gradient background
        backgroundImage: "linear-gradient(180deg, #FFC175 0%, #FFA26B 100%)",
      }}
    >
      <Text>Hey</Text>

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{
          width: 24,
          height: 24,
          fill: "currentColor",
          color: "white",
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <g>
          <path d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"></path>
        </g>
      </svg>
    </View>
  );
}
