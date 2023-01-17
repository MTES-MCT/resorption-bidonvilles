<template>
    <Container class="h-full flex flex-col justify-center">
        <header>
            <RbLogo class="mx-auto" />
            <h1 class="font-bold text-display-md text-center my-12">
                Connectez-vous à<br />Résorption-bidonvilles
            </h1>
        </header>

        <p class="bg-orange300 py-2 px-4 mb-6 text-center" v-if="isExpired">
            Votre session a expiré, veuillez vous reconnecter
        </p>

        <form @submit.prevent="onLogin">
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
    </Container>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import {
    Button,
    TextInput,
    PasswordInput,
    RbLogo,
} from "@resorptionbidonvilles/ui";

export default {
    components: {
        Container,
        Button,
        TextInput,
        PasswordInput,
        RbLogo,
    },
    data() {
        return {
            loading: null,
            error: null,
            email: "",
            password: "",
        };
    },
    computed: {
        isExpired() {
            return this.$route.query && this.$route.query.r === "1";
        },
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
                this.error =
                    err.user_message || "Une erreur inconnue est survenue";
                this.loading = false;
            }
        },
    },
};
</script>
