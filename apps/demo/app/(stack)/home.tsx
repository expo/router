// app/(stack)/home.js
import { Link, ScreenOptions } from 'expo-router';
import { Image, Text, View } from 'react-native';

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
    />
  );
}

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ScreenOptions
        // https://reactnavigation.org/docs/headers#setting-the-header-title
        title="My home"
        // https://reactnavigation.org/docs/headers#adjusting-header-styles
        headerStyle={{ backgroundColor: "#f4511e" }}
        headerTintColor="#fff"
        headerTitleStyle={{
          fontWeight: "bold",
        }}
        // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
        headerTitle={(props) => <LogoTitle {...props} />}
      />

      <Text>Home Screen</Text>
      <Link
        href={{ screen: "details", params: { name: "Bacon" } }}
      >
        Go to Details
      </Link>
    </View>
  );
}
