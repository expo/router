import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import { Link } from "expo-router";
import type Author from "../interfaces/author";

import { View } from "react-native";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

const HeroPost = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {
  return (
    <section>
      <View className="mb-6 md:mb-16">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </View>
      <View className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <View>
          <h3 className="mb-4 text-4xl lg:text-5xl leading-tight">
            <Link
              as={`/posts/${slug}`}
              href="/posts/[slug]"
              className="hover:underline"
            >
              {title}
            </Link>
          </h3>
          <View className="mb-4 md:mb-0 text-lg">
            <DateFormatter dateString={date} />
          </View>
        </View>
        <View>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          <Avatar name={author.name} picture={author.picture} />
        </View>
      </View>
    </section>
  );
};

export default HeroPost;
