import FilArianne from './FilArianne.vue';

export default {
  title: 'FilArianne',
  component: FilArianne,
};

const Template = (args) => ({
  components: { FilArianne },
  template: `<FilArianne :items="${args.items}" />`,
});

export const Empty = {
  render: Template,
  args: {
    items: [],
  },
};

export const SingleItem = () => ({
  components: { FilArianne },
  template: `<FilArianne :items="items" />`,
  data() {
    return {
      items: [
        { label: "Accueil", to: "/" },
      ],
    };
  },
});

export const ManyItems = () => ({
  components: { FilArianne },
  template: `<FilArianne :items="items" />`,
  data() {
    return {
      items: [
        { label: "Accueil", to: "/" },
        { label: "Visualisation des données", to: "/" },
        { label: "Yvelines (78)", to: "/" },
      ],
    };
  },
});
