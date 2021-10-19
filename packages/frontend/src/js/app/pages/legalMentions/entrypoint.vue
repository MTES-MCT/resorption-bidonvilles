<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  metaInfo: {
    title: "Mentions légales",
    titleTemplate: "%s - Résorption Bidonvilles",
  },
  components: {
    Page: () => import("./legalMentions.vue"),
  },
};
</script>
