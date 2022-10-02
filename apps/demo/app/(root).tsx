import { Children, Layout, NativeStack, RootContainer } from "expo-router";

export default function Root() {
  return (
    <Layout>
      <Inner />
    </Layout>
  );
}
function Inner() {
  const isReady = RootContainer.useRef();
  const { pathname, statePath } = Layout.useContext();

  console.log("pathname", !!isReady, pathname, statePath);
  return <Children />;
}
