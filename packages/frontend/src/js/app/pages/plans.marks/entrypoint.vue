<template>
  <Guard>
    <Page />
  </Guard>
</template>

<script>
export default {
  components: {
    Page: () => import("./plans.marks.vue"),
  },
};
</script>
