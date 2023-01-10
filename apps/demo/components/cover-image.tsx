import { Link } from "expo-router";
import { View, Image, Pressable, Platform } from "react-native";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

const CoverImage = ({ title, src, slug }: Props) => {
  const image = (
    <Image
      source={{ uri: src, width: 1300, height: 630 }}
      alt={`Cover Image for ${title}`}
      className={
        "shadow-sm w-full hover:shadow-lg transition-shadow duration-200"
      }
    />
  );
  return (
    <View className="sm:mx-0">
      {slug
        ? Platform.select({
            web: (
              <Link href={`/posts/${slug}`} aria-label={title}>
                {image}
              </Link>
            ),
            default: (
              <Link asChild href={`/posts/${slug}`} aria-label={title}>
                <Pressable>{image}</Pressable>
              </Link>
            ),
          })
        : image}
    </View>
  );
};

export default CoverImage;
