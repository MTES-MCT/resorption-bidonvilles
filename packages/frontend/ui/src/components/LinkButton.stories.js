import LinkButton from './LinkButton.vue';

export default {
  title: 'LinkButton',
  component: LinkButton,
  argTypes: {
    to: {
      control: 'text',
    },
    icon: {
      control: 'select',
      options: [null, 'house-circle-check'],
    },
  },
};

const Template = (args) => ({
  components: { LinkButton },
  template: `<div>
        <LinkButton
            to="${args.to}"
            ${args.icon ? `icon="${args.icon}"` : ''}>
            Accueil
        </LinkButton>
    </div>`,
});

export const InternalLinkWithoutIcon = {
  render: Template,

  args: {
    to: '/',
  },
};

export const InternalLinkWithIcon = {
  render: Template,

  args: {
    to: '/',
    icon: 'house-circle-check',
  },
};

export const ExternalLinkWithIcon = {
  render: Template,

  args: {
    to: 'https://google.fr',
    icon: 'house-circle-check',
  },
};

export const RealLifeExample = function () {
  return {
    components: { LinkButton },
    template: `<div class="flex space-x-4">
            <LinkButton
                to="/"
                icon="house-circle-check">
                Accueil
            </LinkButton>
            <LinkButton
                to="https://blog-resorption-bidonvilles.fr"
                icon="house-circle-check">
                Blog
            </LinkButton>
            <LinkButton
                to="mailto: contact-resorption-bidonvilles@dihal.gouv.fr"
                icon="house-circle-check">
                Aide
            </LinkButton>
        </div>`,
  };
};
