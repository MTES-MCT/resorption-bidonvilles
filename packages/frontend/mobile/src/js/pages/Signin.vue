<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onLogin)">
      <TextInput
        placeholder="marcel.dupont@example.com"
        label="Votre courriel"
        v-model="email"
      />

      <PasswordInput label="Votre mot de passe" v-model="password" />

      <div class="text-center">
        <Button type="submit" class="mb-8" :loading="loading">
          Me connecter
        </Button>

        <div v-if="error" class="bg-red200 p-3 mb-8">
          {{ error }}
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from "vuex";
import { Button, TextInput, PasswordInput } from "@resorptionbidonvilles/ui";

export default {
  data() {
    return {
      loading: null,
      error: null,
      email: "",
      password: "",
    };
  },
  components: {
    Button,
    TextInput,
    PasswordInput,
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "user/loggedIn",
    }),
  },
  methods: {
    async onLogin() {
      try {
        this.error = null;
        this.loading = true;
        await this.$store.dispatch("user/login", {
          email: this.email,
          password: this.password,
        });

        this.$router.push({ path: "/" }).catch(() => {});

        this.loading = false;
      } catch (err) {
        this.error = err.user_message || "Une erreur inconnue est survenue";
        this.loading = false;
        if (err.fields) {
          this.$refs.form.setErrors(err.fields);
        }
      }
    },
  },
};
</script>
