<template>
  <div v-if="loading">Signin you in...</div>
  <div v-else-if="error !== null">Failed signin you in : {{ error }}</div>
  <div v-else>Your access token is : {{ $store.state.user.accessToken }}</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "user/loggedIn",
    }),
  },
  async mounted() {
    if (!this.isLoggedIn) {
      try {
        await this.$store.dispatch("user/login", {
          email: "admin@resorption-bidonvilles.beta.gouv.fr",
          password: "fabnum",
        });
      } catch (error) {
        this.error = error.user_message || error;
      }
    }

    this.loading = false;
  },
};
</script>
