import Link from './Link.vue';

export default {
  title: 'Link',
  component: Link,
  argTypes: {
    to: {
      control: 'text',
    },
    color: {
      control: 'radio',
      options: ['default', 'custom'],
    },
  },
};

const Template = (args) => ({
  components: { Link },
  template: `<Link
        to="${args.to}"
        ${args.color !== 'default' ? `color="text-red400" hover-color="text-red700"` : ''}>
            Je suis un lien
        </Link>`,
});

export const InternalLink = {
  render: Template,

  args: {
    to: '/',
    color: 'default',
  },
};

export const ExternalLink = {
  render: Template,

  args: {
    to: 'https://resorption-bidonvilles.dihal.gouv.fr',
    color: 'default',
  },
};

export const CustomizedLink = {
  render: Template,

  args: {
    to: '/',
    color: 'custom',
  },
};
