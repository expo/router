import { A, Footer, H1, Header, Nav } from '@expo/html-elements';
import { Link } from '@react-navigation/native';
import { BottomTabNavigator, Content } from 'expo-router';
import React from 'react';
import { Image, Platform, useWindowDimensions, View } from 'react-native';


function useWidth(size) {
  const { width } = useWindowDimensions();
  return width >= size;
}

export default function App() {
  const isRowLayout = useWidth(1080);

  if (isRowLayout && Platform.OS === "web") {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <SideBar />
        <View style={{ paddingLeft: 80, flex: 1 }}>
          <Content />
        </View>
      </View>
    );
  }
  return <BottomTabNavigator />;
}

function HeaderLogo() {
  return (
    <A style={{ paddingVertical: 40 }}>
      <H1
        style={{
          margin: 0,
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          maxHeight: 23,
        }}
      >
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 36 / 2,
            backgroundColor: "gray",
          }}
        />
      </H1>
    </A>
  );
}

function SideBar() {
  return (
    <Header
      zIndex={3}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,

        height: "100%",
        justifyContent: "space-between",
        alignItems: "stretch",
        width: 80,
        borderRightWidth: 1,
        borderRightColor: "rgb(230, 230, 230)",
      }}
    >
      <HeaderLogo />

      <VerticalTabBar>
        <Link to="/">
          <Icon />
        </Link>
        <Link to="/profile">
          <Icon />
        </Link>
        <A href="#">
          <Icon />
        </A>
        <A href="#">
          <Icon />
        </A>
        <View>
          <View
            style={{
              width: "33%",
              backgroundColor: "rgba(230, 230, 230, 1)",
              maxHeight: 1,
              height: 1,
            }}
          />
        </View>
        <A href="#">
          <Icon />
        </A>
      </VerticalTabBar>

      <Footer
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 16,
        }}
      >
        <ProfileImage style={{ width: 32, marginVertical: 8, height: 32 }} />
      </Footer>
    </Header>
  );
}

function ProfileImage({ style, ...props }) {
  return (
    <Image
      {...props}
      alt="Evan Bacon"
      source={{
        uri: "https://pbs.twimg.com/profile_images/1452152950810234886/-1PK6cNp_bigger.jpg",
        // uri: "https://miro.medium.com/fit/c/48/48/0*7hpwPqrKW-8i1C3u.jpg",
      }}
      style={[
        {
          backgroundColor: "#71767b",
          width: 24,
          height: 24,
          borderRadius: 999,
          boxShadow: "rgb(0 0 0 / 5%) 0px 0px 0px 1px inset",
        },
        style,
      ]}
    />
  );
}

function Icon() {
  return (
    <View
      style={{
        backgroundColor: "gray",
        width: 24,
        height: 24,
        borderRadius: 12,
      }}
    />
  );
}

function VerticalTabBar({ children }) {
  const newChildren = React.Children.map(children, (child, index) => {
    return (
      <View
        key={String(index)}
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          paddingBottom: 35,
        }}
      >
        {child}
      </View>
    );
  });

  return <Nav>{newChildren}</Nav>;
}
