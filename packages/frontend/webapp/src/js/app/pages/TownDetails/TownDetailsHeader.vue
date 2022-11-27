<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    // Force scroll even if hash is already present in url
    scrollFix(to) {
      if (to === this.$route.hash) {
        const el = document.getElementById(to.slice(1));
        if (el) {
          window.scrollTo(0, el.offsetTop);
        }
      }
    },
    showExport() {
      this.$emit("showExport");
    }
  }
};
</script>
