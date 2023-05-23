import Tag from './Tag.vue';

export default {
  title: 'Tag',
  component: Tag,
};

export const DefaultTag = () => ({
  components: { Tag },
  template: '<Tag>Tag simple</Tag>',
});

export const WithoutBackgroundTag = () => ({
  components: { Tag },
  template: '<Tag variant="withoutBackground">Tag variant "withoutBackground"</Tag>',
});

export const PrimaryTag = () => ({
  components: { Tag },
  template: '<Tag variant="primary">Tag variant "primary"</Tag>',
});

export const HighlightTag = () => ({
  components: { Tag },
  template: '<Tag variant="highlight">Tag variant "highlight"</Tag>',
});

export const DateTag = () => ({
  components: { Tag },
  template: '<Tag variant="date">Tag variant "date"</Tag>',
});

export const PinTag = () => ({
  components: { Tag },
  template: '<Tag variant="pin">Tag variant "pin"</Tag>',
});

export const PinRedTag = () => ({
  components: { Tag },
  template: '<Tag variant="pin_red">Tag variant "pin_red"</Tag>',
});

export const InfoTag = () => ({
  components: { Tag },
  template: '<Tag variant="info">Tag variant "info"</Tag>',
});

export const DeletableTag = () => ({
  components: { Tag },
  template: '<Tag :onDelete="onDelete">Tag qui peut-être supprimé</Tag>',
  methods: {
    onDelete() {
      alert('Tag à supprimer !');
    },
  },
});
