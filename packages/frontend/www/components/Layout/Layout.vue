<template>
  <div>
    <Html lang="fr">
        <Head>
            <Link rel="icon" href="/favicon.ico" />
            <Meta name="description" content="Outil d’information, de partage et de pilotage, la plateforme Résorption-bidonvilles offre une solution performante et efficace pour accélérer la résorption des bidonvilles." />
        </Head>
    </Html>

    <NavBar
      :stickyHeader="stickyHeader"
      :displayLanguagePicker="displayLanguagePicker"
    >
      <template v-slot:anchors><slot name="anchors"></slot></template>
    </NavBar>
    <slot />
    <Footer />
  </div>
</template>

<script>
import Footer from "~/components/Layout/Footer/Footer.vue";
import NavBar from "~/components/Layout/Navbar/Navbar.vue";

export default {
  components: {
    NavBar,
    Footer
  },

  props: {
    stickyHeader: {
      type: Boolean,
      default: true
    },
    displayLanguagePicker: {
      type: Boolean,
      default: true
    }
  }
};
</script>
