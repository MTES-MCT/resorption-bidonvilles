import FooterBar from './FooterBar.vue';

export default {
  title: 'FooterBar',
  component: FooterBar,
};

export const RbFooterBar = () => ({
  components: { FooterBar },
  template: `
    <FooterBar CONTACT_EMAIL="contact@resorption-bidonvilles.beta.gouv.fr" WWW_URL="https://resorption-bidonvilles.beta.gouv.fr" />
    `,
});
