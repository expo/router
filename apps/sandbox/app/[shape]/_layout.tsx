import { Slot } from "expo-router";

export function generateStaticParams() {
  return ["circle"].map((shape) => ({ shape }));
}

export default function Layout() {
  return <Slot />;
}
