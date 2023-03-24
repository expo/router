import { Slot } from "expo-router";

export function generateStaticParams() {
  return ["foo-1", "bar-1"].map((alpha) => ({ alpha }));
}

export default function Layout() {
  return <Slot />;
}
