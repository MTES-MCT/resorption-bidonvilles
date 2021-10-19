<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  components: {
    Page: () => import("./plans.edit.vue"),
  },
};
</script>
