import { View } from "react-native";
import { Layout, Link, Children, useHref } from "expo-router";

import { TabRouter } from "@react-navigation/native";

export default function Page() {
  const { pathname } = useHref();

  // When the given query is 404 show site map by simply rendering <Children />
  return !pathname.includes("[...404]") ? (
    <Layout router={TabRouter}>
      <Children />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "blue",
        }}
      >
        <Link href="/post/12321" style={{ color: "white" }}>
          Open modal
        </Link>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "green",
        }}
      >
        <Link href="/post/12321">Open modal</Link>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "yellow",
        }}
      >
        <Link href="/post/12321">Open modal</Link>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Link href="/post/12321" style={{ color: "white" }}>
          Open modal
        </Link>
      </View>
    </Layout>
  ) : (
    <Children />
  );
}
