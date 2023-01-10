import { View, Image } from "@bacons/react-views";

type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <View className="flex items-center">
      <Image
        source={{ uri: picture }}
        className="w-12 h-12 rounded-full mr-4"
        alt={name}
      />
      <p className="text-xl font-bold">{name}</p>
    </View>
  );
};

export default Avatar;
