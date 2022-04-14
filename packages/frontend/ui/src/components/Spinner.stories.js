import Spinner from './Spinner.vue';
import Icon from './Icon.vue';

export default {
    title: 'Spinner',
    component: Spinner,
    argTypes: {}
};

const Template = (args) => ({
    components: { Spinner, Icon },
    template: `<Spinner />`
});

export const SimpleSpinner = Template.bind({});
