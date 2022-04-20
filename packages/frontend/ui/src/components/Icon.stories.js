import Icon from './Icon.vue';

export default {
    title: 'Icon',
    component: Icon,
    argTypes: {
        icon: {
            control: 'select',
            options: ['house-circle-check']
        },
        spin: {
            control: 'radio',
            options: [true, false]
        }
    }
};

const Template = (args) => ({
    components: { Icon },
    template: `<Icon icon="${args.icon}" :spin="${args.spin}" />`
});

export const SimpleIcon = Template.bind({});
SimpleIcon.args = {
    icon: 'house-circle-check',
    spin: false
};

export const SpinningIcon = Template.bind({});
SpinningIcon.args = {
    icon: 'house-circle-check',
    spin: true
};
