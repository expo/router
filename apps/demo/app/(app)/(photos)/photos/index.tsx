import { H3 } from "@expo/html-elements";
import { Link } from "expo-router";
import { Head } from "../../../../components/head";
import { View } from "react-native";

export default function Photos() {
  return (
    <>
      <View className="container mx-2">
        <Head>
          <title>Photos</title>
        </Head>
        <H3>Look at my photos</H3>

        <Link href="/photos/123">Photo 123</Link>
        <Link href="/modal">Open modal</Link>
      </View>
    </>
  );
}
