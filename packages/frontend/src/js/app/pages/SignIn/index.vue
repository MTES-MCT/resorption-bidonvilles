<template>
    <LoginLayout title="Connectez-vous à Résorption-bidonvilles">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onLogin)">
                <TextInput
                    placeholder="marcel.dupont@example.com"
                    label="Votre courriel"
                    v-model="email"
                    rules="required"
                    id="email"
                    cypressName="email"
                />

                <PasswordInput
                    label="Votre mot de passe"
                    v-model="password"
                    rules="required"
                    id="password"
                    cypressName="password"
                />

                <div class="text-center">
                    <Button type="submit" class="mb-8" :loading="loading">
                        Me connecter
                    </Button>

                    <div v-if="error" class="bg-red200 p-3 mb-8">
                        {{ error }}
                    </div>

                    <div class="flex items-center">
                        <router-link to="contact" class="w-1/2 text-primary"
                            >Demander un accès</router-link
                        >
                        <div class="mx-2">|</div>
                        <router-link
                            to="nouveau-mot-de-passe"
                            class="w-1/2 text-primary"
                            >Mot de passe oublié</router-link
                        >
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { login } from "#helpers/api/user";

export default {
    components: {
        LoginLayout
    },
    data() {
        return {
            email: "",
            password: "",
            error: null,
            loading: null
        };
    },
    methods: {
        async onLogin() {
            try {
                this.error = null;
                this.loading = true;
                await login(this.email, this.password);
                this.$trackMatomoEvent("Login", "Connection");
                window.localStorage.setItem("logged_once", true);
                this.$router.push({ path: "/" });
                this.loading = false;
            } catch (err) {
                this.error = err.user_message;
                this.loading = false;
                if (err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }
            }
        }
    }
};
</script>
