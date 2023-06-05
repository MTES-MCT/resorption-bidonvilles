import RbLogo from './RbLogo.vue';

export default {
  title: 'RbLogo',
  component: RbLogo,
  argTypes: {},
};

const Template = () => ({
  components: { RbLogo },
  template: `<RbLogo />`,
});

export const DefaultRbLogo = {
  render: Template,
};
