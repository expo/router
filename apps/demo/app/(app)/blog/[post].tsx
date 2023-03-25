import { ErrorBoundaryProps, Stack, useSearchParams } from "expo-router";
import Head from "expo-router/head";
import { View, Text } from "react-native";

export async function generateStaticParams() {
  return Object.values(data).map(({ id }) => ({ post: id }));
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Error: {props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

export default function Post() {
  const params = useSearchParams<{ post: string }>();
  const post = data.find((post) => post.id === params.post);

  if (!post) {
    throw new Error(`Post not found: ${params.post}`);
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.text} />
      </Head>
      <Stack.Screen options={{ title: post.title }} />
      <View style={{ flex: 1 }}>
        <Text>Post: {post.title}</Text>
        <Text>Post: {post.text}</Text>
      </View>
    </>
  );
}

const data = [
  {
    id: "rfc",
    title: "RFC: Expo Router",
    text: "This is a test post for the RFC: Expo Router",
  },
  {
    id: "v1",
    title: "Expo Router v1",
    text: "This is a test post for the RFC: Expo Router",
  },
  {
    id: "rfc-2",
    title: "RFC: Expo Router v2",
    text: "This is a test post for the RFC: Expo Router",
  },
];
