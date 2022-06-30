<template>
  <div>
    <TextInput
      v-model="email"
      label="Votre courriel"
      placeholder="marcel.dupont@exemple.com"
    />
    <Button>Valider</Button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Button, TextInput } from "@resorptionbidonvilles/ui";

export default {
  data() {
    return {
      loading: true,
      error: null,
      email: "",
      password: "",
    };
  },
  components: {
    Button,
    TextInput,
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "user/loggedIn",
    }),
  },
};
</script>
