import { useSearchParams } from "expo-router";
import { Head } from "../../../../components/head";
export default function About() {
  const { id } = useSearchParams();
  return (
    <>
      <Head>
        <title>Photo: {id}</title>
      </Head>
      <p>Photo: {id}</p>
    </>
  );
}
