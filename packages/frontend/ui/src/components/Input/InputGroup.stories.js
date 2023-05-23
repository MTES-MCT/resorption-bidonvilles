import InputGroup from './InputGroup.vue';

export default {
  title: 'InputGroup',
  component: InputGroup,
};

export const RegularInputGroup = () => ({
  components: { InputGroup },
  template:
    '<InputGroup title="Titre du groupe" info="Info du groupe"><input type="text" class="border" /></InputGroup>',
});
