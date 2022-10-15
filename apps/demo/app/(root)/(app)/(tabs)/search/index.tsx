import { Head } from "@bacons/head";
import { NativeStack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import * as Linking from "expo-linking";

import { useAssets } from "expo-asset";
export default function App() {
  const route = useRoute<any>();
  const def = useMemo(
    () => (route.params?.q ? decodeURIComponent(route.params?.q) : ""),
    [route.params?.q]
  );

  const [assets] = useAssets([require("../../../../../bacon.png")]);

  return (
    <>
      <Head>
        <title>Search it | Bacon App 🥓</title>
        {/* <meta name="description" content="Do beta stuff" />
        <meta name="keywords" content="bacon,food,app" /> */}
        {assets?.[0].localUri && (
          <meta property="og:image" content={assets?.[0].localUri} />
        )}
        <meta
          property="og:image"
          media="(prefers-color-scheme: dark)"
          content={"https://icogen.vercel.app/api/icon?color=black&icon=1f953"}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: Linking.createURL("/"),
            potentialAction: {
              "@type": "SearchAction",
              target: Linking.createURL("/search", {
                queryParams: {
                  q: "{search_term_string}",
                },
              }),
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Head>
      <NativeStack.Screen
        options={{
          title: "Search",
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: "Search",
            autoFocus: true,
          },
        }}
      />
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }}>Search</Text>
        <Text style={{ fontSize: 24 }}>Default: {def}</Text>
        <Text style={{ fontSize: 24 }}>From external: {route.params?.ref}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
