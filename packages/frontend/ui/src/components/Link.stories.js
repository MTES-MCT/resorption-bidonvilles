import Link from './Link.vue';

export default {
    title: 'Link',
    component: Link,
    argTypes: {
        to: {
            control: 'text'
        },
        color: {
            control: 'radio',
            options: ['default', 'custom'],
        }
    }
};

const Template = (args) => ({
    components: { Link },
    template: `<Link
        to="${args.to}"
        ${args.color !== 'default' ? `color="text-red400" hover-color="text-red700"` : ''}>
            Je suis un lien
        </Link>`
});

export const InternalLink = Template.bind({});
InternalLink.args = {
    to: '/',
    color: 'default'
};

export const ExternalLink = Template.bind({});
ExternalLink.args = {
    to: 'https://resorption-bidonvilles.beta.gouv.fr',
    color: 'default'
};

export const CustomizedLink = Template.bind({});
CustomizedLink.args = {
    to: '/',
    color: 'custom'
};
