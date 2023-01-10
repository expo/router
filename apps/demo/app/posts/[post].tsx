import { useRouter, useSearchParams } from "expo-router";
// import ErrorPage from "next/error";
import { Head } from "../../components/head";

import "@expo/html-elements";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";

// import { getPostBySlug, getAllPosts } from "../../../lib/api";
// import markdownToHtml from "../../../lib/markdownToHtml";

import type PostType from "../../interfaces/post";
import { Text } from "react-native";

type Props = {
  post: PostType;
  preview?: boolean;
};

function ErrorPage() {
  return <Text>Error 404!1!</Text>;
}

import { posts } from "../../posts/data";

export default function Post() {
  const params = useSearchParams();
  const post = posts.find((post) => post.slug === params.post);
  // Emulate `getStaticProps` working.
  return <PostQualified post={post} preview={true} />;
}
function PostQualified({ post, preview }: Props) {
  const router = useRouter();
  // if (!router.isFallback && !post?.slug) {
  //   return <ErrorPage statusCode={404} />;
  // }
  if (!post) {
    return <ErrorPage />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />

        <article className="mb-32">
          <Head>
            <title>{post.title} | Expo Blog Example</title>
            <meta property="og:image" content={post.ogImage.url} />
          </Head>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={post.content} />
        </article>
      </Container>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  //   const post = getPostBySlug(params.slug, [
  //     "title",
  //     "date",
  //     "slug",
  //     "author",
  //     "content",
  //     "ogImage",
  //     "coverImage",
  //   ]);
  //   const content = await markdownToHtml(post.content || "");
  //   return {
  //     props: {
  //       post: {
  //         ...post,
  //         content,
  //       },
  //     },
  //   };
}

export async function getStaticPaths() {
  //   const posts = getAllPosts(["slug"]);
  //   return {
  //     paths: posts.map((post) => {
  //       return {
  //         params: {
  //           slug: post.slug,
  //         },
  //       };
  //     }),
  //     fallback: false,
  //   };
}
