import { View } from "@bacons/react-views";

type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <View className="container mx-auto px-5">{children}</View>;
};

export default Container;
