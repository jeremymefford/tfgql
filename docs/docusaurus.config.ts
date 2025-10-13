import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import versions from "./versions.json";

const versionList = versions as string[];
const latestTaggedVersion = versionList[0] ?? null;
const latestMinorLabel = latestTaggedVersion
  ? `${latestTaggedVersion.split(".").slice(0, 2).join(".")}.x`
  : null;
const currentDocsLabel = latestMinorLabel
  ? `${latestMinorLabel} (Current)`
  : "Next";
const taggedVersionMetadata = Object.fromEntries(
  versionList.map((version) => [
    version,
    {
      label: version,
      path: version,
    },
  ]),
);

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "TFGQL",
  tagline: "GraphQL facade for HCP Terraform and Terraform Enterprise",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: "https://jeremymefford.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/tfgql/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jeremymefford", // Usually your GitHub org/user name.
  projectName: "tfgql", // Usually your repo name.

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
    mermaid: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: currentDocsLabel,
              banner: "none",
            },
            ...taggedVersionMetadata,
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
    navbar: {
      title: "TFGQL",
      logo: {
        alt: "TFGQL Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "getting-started",
          label: "Docs",
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
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
              label: "Tutorial",
              to: "getting-started",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jeremymefford/tfgql",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
