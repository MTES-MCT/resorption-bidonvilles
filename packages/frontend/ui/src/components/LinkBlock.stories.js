import LinkBlock from './LinkBlock.vue';

export default {
  title: 'LinkBlock',
  component: LinkBlock,
  argTypes: {
    to: {
      control: 'text',
    },
    icon: {
      control: 'select',
      options: [null, 'house-circle-check'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'black'],
    },
    active: {
      control: 'select',
      options: [true, false],
    },
  },
};

const Template = (args) => ({
  components: { LinkBlock },
  template: `<LinkBlock
        to="${args.to}"
        variant="${args.variant}"
        :active="${args.active}"
        ${args.icon ? `icon="${args.icon}"` : ''}>
            Je suis un lien
        </LinkBlock>`,
});

export const LinkWithoutIcon = {
  render: Template,

  args: {
    to: '/',
    variant: 'primary',
    active: false,
  },
};

export const BlackLink = {
  render: Template,

  args: {
    to: '/',
    variant: 'black',
    active: false,
  },
};

export const BlackLinkActive = {
  render: Template,

  args: {
    to: '/',
    variant: 'black',
    active: true,
  },
};

export const LinkWithIcon = {
  render: Template,

  args: {
    to: '/',
    variant: 'primary',
    active: false,
    icon: 'house-circle-check',
  },
};
