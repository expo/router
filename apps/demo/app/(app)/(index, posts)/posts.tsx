import { Link } from "expo-router";
import { Head } from "../../../components/head";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <h3>My writing and ideas</h3>
      <Link href={"./"}>Push index</Link>
      <Link href={"/"}>Go to about</Link>
    </>
  );
}
