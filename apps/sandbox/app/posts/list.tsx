import { Link } from "expo-router";
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
  const posts = usePosts();

  if (posts === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List of posts:</Text>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} style={styles.link}>
          Post: {post.id}
        </Link>
      ))}
      <Link href={`/posts/69`} style={styles.link}>
        Post: Invalid
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },

  link: {
    fontSize: 24,
    color: "dodgerblue",
  },
  title: {
    fontSize: 36,

    fontWeight: "bold",
  },
});
