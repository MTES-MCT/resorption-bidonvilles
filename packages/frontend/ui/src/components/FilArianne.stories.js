import FilArianne from './FilArianne.vue';

export default {
  title: 'FilArianne',
  component: FilArianne,
  argTypes: {},
};

const Template = (args) => ({
  components: { FilArianne },
  template: `<FilArianne />`,
});

export const Empty = {
  render: Template,
  args: {},
};
