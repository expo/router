import { Head, useSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import React from "react";
function usePosts() {
  const [posts, setPosts] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/posts/get")
      .then((v) => v.json())
      .then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return posts;
}

export default function Page() {
  const { post } = useSearchParams();
  const posts = usePosts();

  if (posts === null) {
    return (
      <View style={styles.container}>
        <Head>
          <title>Loading...</title>
        </Head>
        <View style={styles.main}>
          <Text style={styles.title}>Loading Post {post}...</Text>
        </View>
      </View>
    );
  }

  console.log("posts", posts, "post", post);
  const target = posts?.find((item) => item.id == post);

  if (target === undefined) {
    return (
      <View style={styles.container}>
        <Head>
          <title>Not Found!</title>
        </Head>
        <View style={styles.main}>
          <Text style={styles.title}>Post {post} not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head>
        <title>{target.title}</title>
      </Head>
      <View style={styles.main}>
        <Text style={styles.title}>{target.title}</Text>
        <Text style={styles.subtitle}>{target.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    color: "#38434D",
  },
});
