/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": ["../src/**/*.stories.js"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials",
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
  ],
  "framework": {
    name: "@storybook/vue3-webpack5",
    options: {
      fsCache: true,
      lazyCompilation: true,
    },
  },
  docs: {
    autodocs: true
  }
}
export default config;
