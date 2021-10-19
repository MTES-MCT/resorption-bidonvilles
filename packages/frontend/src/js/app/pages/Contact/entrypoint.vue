<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  metaInfo: {
    title: "Contact",
    titleTemplate: "%s - Résorption Bidonvilles",
  },
  components: {
    Page: () => import("./index.vue"),
  },
};
</script>
