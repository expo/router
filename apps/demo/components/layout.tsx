import { View } from "@bacons/react-views";
import { ScrollView } from "react-native";

import { Alert } from "./alert";
import Footer from "./footer";
import Meta from "./meta";

type Props = {
  preview?: boolean;
  children: React.ReactNode;
};

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <Meta />
      <ScrollView style={{ flex: 1 }}>
        <View className="min-h-screen">
          <Alert />
          <main>{children}</main>
        </View>
        <Footer />
      </ScrollView>
    </>
  );
};

export default Layout;
