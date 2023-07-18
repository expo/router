// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Expo Router",
  tagline: "File-based Routing for React Native apps",
  url: "https://expo.github.io",
  baseUrl: "/router/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "expo", // Usually your GitHub org/user name.
  projectName: "router", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // routeBasePath: "/", // Serve the docs at the site's root
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/expo/router/tree/main/docs/",
        },
        blog: false, // Optional: disable the blog plugin
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: "MNYP430BS2",

        // Public API key: it is safe to commit it
        apiKey: "109a300c47881b9e264a48050730d46c",

        indexName: "expo-router",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
      announcementBar: {
        id: "v2-notice",
        content:
          'Expo Router v2 and Expo SDK 49 are stable. The docs are moving to <a href="https://docs.expo.dev/routing/introduction/">docs.expo.dev</a>.',
        backgroundColor: "#fafbfc",
        textColor: "#091E42",
        isCloseable: true,
      },
      image: "img/og-image.png",
      navbar: {
        title: "Expo Router",
        logo: {
          alt: "Expo logo",
          srcDark: "img/logo.dark.svg",
          src: "img/logo.light.svg",
          href: "/docs",
        },

        items: [
          {
            to: "/docs/features/routing",
            label: "Features",
            position: "left",
          },
          {
            href: "https://github.com/expo/router",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Start",
                to: "/docs",
              },
              {
                label: "Features",
                to: "/docs/features/routing",
              },
              {
                label: "Guides",
                to: "/docs/category/guides",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://chat.expo.dev/",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/expo",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Created by Evan Bacon",
                href: "https://twitter.com/baconbrix",
              },
              {
                label: "Work with us at Expo",
                href: "https://expo.dev/careers",
              },
              {
                label: "Source code",
                href: "https://github.com/expo/router",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 650 Industries - The team behind Expo and EAS.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
