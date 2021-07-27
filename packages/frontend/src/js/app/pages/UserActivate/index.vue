<template>
    <LoginLayout title="Activer mon compte">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onLogin)">
                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    rules="required"
                    id="email"
                    size="sm"
                />

                <TextInput
                    label="Votre mot de passe"
                    v-model="password"
                    rules="required"
                    id="password"
                    type="password"
                />

                <PasswordInfo />

                <Button
                    type="submit"
                    variant="tertiary"
                    class="mb-4"
                    :loading="loading"
                >
                    Activer mon compte
                </Button>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { login } from "#helpers/api/user";
import PasswordInfo from "#app/components/LoginLayout/PasswordInfo";

export default {
    components: {
        PasswordInfo,
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
            }
        }
    }
};
</script>
