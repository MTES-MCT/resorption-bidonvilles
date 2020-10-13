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
        text: 'Components',
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
          title: 'Primitives',
          collapsable: false,
          children: [
            'Button',
            'Text',
            'Icon',
            'Link',
          ]
        },
        {
          title: 'Form',
          collapsable: false,
          children: [
            'form/CheckboxRadio',
            'form/TextInputSelect',
            'form/FormGroup'
          ]
        },
        {
          title: 'Components',
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
            'components/Spinner',
          ]
        },
        {
          title: 'Examples',
          collapsable: false,
          children: [
            'examples/Grid',
            'examples/Login',
            'examples/Shantytown',
            'examples/StateDesignSystem',
          ]
        },
        {
          title: 'Todo',
          collapsable: false,
          children: [
            'Todo',
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
