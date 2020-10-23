const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Design System - Résorption Bidonvilles',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Composants',
        link: '/design/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/MTES-MCT/action-bidonvilles/tree/design-system/src/js/app/components/ui'
      }
    ],
    sidebar: {
      '/design/': [
        {
          title: 'Fondamentaux',
          collapsable: false,
          children: [
            'fundamentals/Spacing',
            'fundamentals/Grid',
            'fundamentals/Colors',
            'fundamentals/Typography',
            'fundamentals/FormValidation',
          ]
        },
        {
          title: 'Primitives / Form',
          collapsable: false,
          children: [
            'primitives/Button',
            'primitives/Icon',
            'primitives/Link',
            'primitives/Spinner',
            'primitives/TextInputSelect',
            'primitives/CheckboxRadio',
            'primitives/FormGroup'
          ]
        },

        {
          title: 'Composants',
          collapsable: false,
          children: [
            'components/Autocomplete',
            'components/Datepicker',
            'components/Dropdown',
            'components/Modal',
            'components/SidePanel',
            'components/Callout',
            'components/Notification',
            'components/Table',
            'components/Tag',

          ]
        },
        {
          title: 'Exemples',
          collapsable: false,
          children: [
            'examples/Grid',
            'examples/Login',
            'examples/Shantytown',
            'examples/StateDesignSystem',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom'
  ],
  postcss: {
    plugins: [require('tailwindcss')('./tailwind.config.js'), require('autoprefixer')],
  },
}
