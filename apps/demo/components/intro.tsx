const CMS_NAME = "Markdown";

const Intro = () => {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-4xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Blog.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A universal blog example using{" "}
        <a
          href="http://expo.dev/"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          Expo
        </a>{" "}
        and {CMS_NAME}.
      </h4>
    </section>
  );
};

export default Intro;
