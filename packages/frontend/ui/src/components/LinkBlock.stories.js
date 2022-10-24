import LinkBlock from './LinkBlock.vue';

export default {
    title: 'LinkBlock',
    component: LinkBlock,
    argTypes: {
        to: {
            control: 'text'
        },
        icon: {
            control: 'select',
            options: [null, 'house-circle-check']
        },
        variant: {
            control: 'select',
            options: ['primary', 'black']
        },
        active: {
            control: 'select',
            options: [true, false]
        }
    }
};

const Template = (args) => ({
    components: { LinkBlock },
    template: `<LinkBlock
        to="${args.to}"
        variant="${args.variant}"
        :active="${args.active}"
        ${args.icon ? `icon="${args.icon}"` : ''}>
            Je suis un lien
        </LinkBlock>`
});

export const LinkWithoutIcon = Template.bind({});
LinkWithoutIcon.args = {
    to: '/',
    variant: 'primary',
    active: false
};

export const BlackLink = Template.bind({});
BlackLink.args = {
    to: '/',
    variant: 'black',
    active: false
};

export const BlackLinkActive = Template.bind({});
BlackLinkActive.args = {
    to: '/',
    variant: 'black',
    active: true
};

export const LinkWithIcon = Template.bind({});
LinkWithIcon.args = {
    to: '/',
    variant: 'primary',
    active: false,
    icon: 'house-circle-check'
};

