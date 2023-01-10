import { Pressable, Text, View } from "react-native";
import Container from "./container";

export const Alert = () => {
  return (
    <View className="border-b bg-neutral-50 border-neutral-200">
      <Container>
        <Text className="py-2 text-center text-sm">
          The source code for this blog is{" "}
          <Pressable className="hover:text-blue-600 duration-200 transition-colors">
            <a href={`https://github.com/expo/router`} className="underline">
              available on GitHub
            </a>
          </Pressable>
          .
        </Text>
      </Container>
    </View>
  );
};
