<template>
    <LoginLayout title="Mot de passe oublié">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onRequestNewPassword)">
                <div>
                    Vous avez oublié votre mot de passe ? Pas d'inquiétude !
                    Nous allons vous envoyer la marche à suivre pour renouveler
                    votre mot de passe par courriel.
                </div>

                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    rules="required"
                    id="email"
                    size="sm"
                />

                <Button
                    type="submit"
                    variant="tertiary"
                    class="mb-4"
                    :loading="loading"
                >
                    Renouveler mon mot de passe
                </Button>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { requestNewPassword } from "#helpers/api/user";

export default {
    components: {
        LoginLayout
    },
    data() {
        return {
            email: "",
            error: null,
            loading: null
        };
    },
    methods: {
        async onRequestNewPassword() {
            try {
                this.error = null;
                this.loading = true;
                await requestNewPassword(this.email);
            } catch (err) {
                this.error = err.user_message;
            }
            this.loading = false;
        }
    }
};
</script>
