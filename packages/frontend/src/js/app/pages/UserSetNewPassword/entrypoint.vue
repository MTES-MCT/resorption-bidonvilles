<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  components: {
    Page: () => import("./index.vue"),
  },
};
</script>
