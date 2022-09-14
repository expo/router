// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNamedNavigationChildren } from 'expo-router';

// const Nav = createBottomTabNavigator();

// export default function App() {
//   const { "[card]": card, index, ...rest } = useNamedNavigationChildren();

//   return <Nav.Navigator initialRouteName="card" screenOptions={{
//     headerShown: false
//   }}>
//     {index}
//     {card}
//     {Object.values(rest)}
//   </Nav.Navigator>;
// }

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useNamedNavigationChildren } from 'expo-router';

import { Navigator } from "../navigators/Tab";
// const Nav = createBottomTabNavigator();

export default function App() {
  // const { "[card]": card, index, ...rest } = useNamedNavigationChildren();

  return (
    <Navigator
      initialRouteName="card"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Navigator.TabBar style={{ backgroundColor: "orange" }}>
        <Navigator.TabBar.Item to="modal">
          {/* <Navigator.TabBar.Item.Icon name="home" /> */}
          <Navigator.TabBar.Item.Label>Modal!</Navigator.TabBar.Item.Label>
        </Navigator.TabBar.Item>
        <Navigator.TabBar.Item to="error-boundary">
          {/* <Navigator.TabBar.Item.Icon name="home" /> */}
          <Navigator.TabBar.Item.Label>Error Boundary</Navigator.TabBar.Item.Label>
        </Navigator.TabBar.Item>
      </Navigator.TabBar>
    </Navigator>
  );
}
