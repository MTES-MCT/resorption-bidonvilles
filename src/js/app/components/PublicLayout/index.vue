<template>
  <div>
    <NavBar :stickyHeader="stickyHeader" />
    <slot />
    <PublicFooter />
  </div>
</template>

<script>
import NavBar from "./NavBar/index.vue";
import PublicFooter from "./PublicFooter.vue";

export default {
  props: {
    stickyHeader: {
      type: Boolean,
      default: true
    }
  },
  components: {
    NavBar,
    PublicFooter
  }
};
</script>
