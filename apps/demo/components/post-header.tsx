import Avatar from "./avatar";
import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import PostTitle from "./post-title";
import type Author from "../interfaces/author";

import { View } from "react-native";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
};

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <View className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
      </View>
      <View className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </View>
      <View className="max-w-2xl mx-auto">
        <View className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </View>
        <View className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </View>
      </View>
    </>
  );
};

export default PostHeader;
