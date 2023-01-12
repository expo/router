import { Link } from "expo-router";
import { Head } from "../../../components/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <h2>About</h2>
      <Link href={"/(app)/(index)/posts"}>Push posts</Link>
      <Link href={"/posts"}>Go to posts</Link>
    </>
  );
}
