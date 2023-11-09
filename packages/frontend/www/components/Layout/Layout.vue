<template>
  <div>
    <Html lang="fr">

    <Head>
      <Link rel="icon" href="/favicon.ico" />
      <Meta name="description"
        content="Outil d’information, de partage et de pilotage, la plateforme Résorption-bidonvilles offre une solution performante et efficace pour accélérer la résorption des bidonvilles." />
    </Head>

    </Html>

    <SkipToMainContentLink />

    <NavBar :stickyHeader="stickyHeader" :displayLanguagePicker="displayLanguagePicker">
      <template v-slot:anchors>
        <slot name="anchors"></slot>
      </template>
    </NavBar>
    <slot />
    <FooterBar :WWW_URL="WWW_URL" :CONTACT_EMAIL="CONTACT_EMAIL" />
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { SkipToMainContentLink, FooterBar } from "@resorptionbidonvilles/ui";
import NavBar from "~/components/Layout/Navbar/Navbar.vue";

const props = defineProps({
  stickyHeader: {
    type: Boolean,
    default: true
  },
  displayLanguagePicker: {
    type: Boolean,
    default: true
  }
});
const { stickyHeader, displayLanguagePicker } = toRefs(props);
const { WWW_URL, CONTACT_EMAIL } = useRuntimeConfig().public;
</script>
