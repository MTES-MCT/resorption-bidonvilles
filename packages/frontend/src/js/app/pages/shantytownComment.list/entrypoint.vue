<template>
  <Guard> <Page /></Guard>
</template>

<script>
export default {
  components: {
    Page: () => import("./shantytownComment.list.vue"),
  },
};
</script>
