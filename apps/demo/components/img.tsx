import { Image, ImageProps } from "expo-image";

// expo-image doesn't support accessibility props on web :[
export default function BetterImage(props: ImageProps & { alt?: string }) {
  return (
    <Image
      {...props}
      accessibilityLabel={props.alt ?? props.accessibilityLabel}
    />
  );
}
