<template>
  <div>
    <div class="mx-4 my-4 font-bold text-xl">
      Bienvenue {{ user.first_name }} {{ user.last_name }}
    </div>

    <Button @click="disconnect" class="mb-8"> Me déconnecter </Button>
  </div>
</template>

<script>
import { Button } from "@resorptionbidonvilles/ui";

export default {
  components: {
    Button
  },
  computed: {
    user() {
      return this.$store.state.config.configuration.user;
    }
  },
  methods: {
    disconnect() {
      this.$router.push("/deconnexion");
    }
  }
};
</script>
