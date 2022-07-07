<template>
  <div />
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("user/logout", this.$piwik).then(() => {
      this.$router.push("/").catch(() => {});
    });
  },
};
</script>
