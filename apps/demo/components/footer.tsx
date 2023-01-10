import Container from "./container";
import { Pressable, View } from "react-native";

const IFooter = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <View className="py-24 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-[2.5rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Universal React
          </h3>
          <View className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://nextjs.org/docs/basic-features/pages"
              className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              Read Documentation
            </a>
            <Pressable className="hover:underline">
              <a
                href="https://github.com/expo/router"
                className="mx-3 font-bold hover:underline"
              >
                View on GitHub
              </a>
            </Pressable>
          </View>
        </View>
      </Container>
    </footer>
  );
};

export default IFooter;
