import { Slot } from "expo-router";

export function generateStaticParams() {
  return ["circle", "starfruit"].map((shape) => ({ shape }));
}

export default function Layout() {
  return <Slot />;
}
