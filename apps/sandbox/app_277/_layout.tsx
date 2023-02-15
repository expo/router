import { Slot, usePathname, useSearchParams } from "expo-router";

export default function Layout() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log('_layout.tsx', pathname, searchParams);

  return <Slot />;
}
