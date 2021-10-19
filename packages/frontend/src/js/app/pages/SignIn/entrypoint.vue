<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  metaInfo: {
    title: "Connexion",
    titleTemplate: "%s - Résorption Bidonvilles",
  },
  components: {
    Page: () => import("./index.vue"),
  },
};
</script>
