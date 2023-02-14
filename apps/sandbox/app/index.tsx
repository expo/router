import { Link } from "expo-router";
import React, { ReactNode } from "react";
import { View, Text } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Page!</Text>
      <StyledLink href="/1">Humpty</StyledLink>
      <StyledLink href="/1/2">Humpty Dumpty</StyledLink>
      <StyledLink href="/1/2/3">Humpty Dumpty Sat</StyledLink>
    </View>
  );
}

const StyledLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    style={{ fontSize: 20, marginVertical: 10, marginHorizontal: 20 }}
  >
    {children}
  </Link>
);
