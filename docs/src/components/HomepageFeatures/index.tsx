import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        Expo router's File-based routing system makes it easy to develop and
        maintain complex applications with ease. Features like deep linking and
        404s are built-in automatically.
      </>
    ),
  },
  {
    title: "Share Anywhere",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        By simply using Expo router, every part of your application is
        automatically shareable with a native URI. You can link users to the
        parts of your app that matter most.
      </>
    ),
  },
  {
    title: "Powered by React Native",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        Expo router is built on top of React Native, a library used to power the
        largest apps from around the world: Facebook, Instagram, Coinbase,
        Discord, Shopify, Tesla, Pintrest, Xbox, Playstation and many more.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
