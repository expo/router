import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const PostTitle = ({ children }: Props) => {
  return (
    <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-loose mb-12 text-center md:text-left">
      {children}
    </h1>
  );
};

export default PostTitle;
