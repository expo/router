import { Children, Layout, NativeStack } from "expo-router";

export default function Root() {
  return (
    <Layout>
      <Inner />
    </Layout>
  );
}
function Inner() {
  const { pathname, statePath } = Layout.useContext();

  console.log("pathname", pathname, statePath);
  return <Children />;
}
