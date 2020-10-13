const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'RB Design System',
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
        text: 'Design System',
        link: '/design/',
      },
      {
        text: 'VuePress',
        link: 'https://v1.vuepress.vuejs.org'
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
