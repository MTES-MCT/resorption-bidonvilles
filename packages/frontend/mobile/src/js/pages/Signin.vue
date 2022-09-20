<template>
    <Container class="h-full flex flex-col justify-center">
        <header>
            <RbLogo class="mx-auto" />
            <h1 class="font-bold text-display-md text-center my-12">
                Connectez-vous à<br />Résorption-bidonvilles
            </h1>
        </header>

        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form
                @submit.prevent="handleSubmit(onLogin)"
                class="mx-auto max-w-sm"
            >
                <TextInput
                    placeholder="marcel.dupont@example.com"
                    label="Votre courriel"
                    v-model="email"
                />

                <PasswordInput label="Votre mot de passe" v-model="password" />

                <div class="text-center mt-12">
                    <Button type="submit" class="mb-8" :loading="loading">
                        Me connecter
                    </Button>

                    <div v-if="error" class="bg-red200 p-3 mb-8">
                        {{ error }}
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </Container>
</template>

<script>
import { mapGetters } from "vuex";
import Container from "#src/js/components/Container.vue";
import {
    Button,
    TextInput,
    PasswordInput,
    RbLogo
} from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        Button,
        TextInput,
        PasswordInput,
        RbLogo
    },
    data() {
        return {
            loading: null,
            error: null,
            email: "",
            password: ""
        };
    },
    computed: {
        ...mapGetters({
            isLoggedIn: "user/loggedIn"
        })
    },
    methods: {
        async onLogin() {
            try {
                this.error = null;
                this.loading = true;
                await this.$store.dispatch("user/login", {
                    email: this.email,
                    password: this.password
                });

                this.$router.push({ path: "/" }).catch(() => {});

                this.loading = false;
            } catch (err) {
                this.error =
                    err.user_message || "Une erreur inconnue est survenue";
                this.loading = false;
                if (err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }
            }
        }
    }
};
</script>
