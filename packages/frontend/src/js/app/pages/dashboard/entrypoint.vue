<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  components: {
    Page: () => import("./dashboard.vue"),
  },
};
</script>
