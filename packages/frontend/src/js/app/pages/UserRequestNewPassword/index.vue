<template>
    <LoginLayout title="Mot de passe oublié">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onRequestNewPassword)">
                <div class="mb-8 -mx-32 text-center">
                    Vous avez oublié votre mot de passe ? Pas d'inquiétude !
                    Nous allons vous envoyer la marche à suivre pour renouveler
                    votre mot de passe par courriel.
                </div>

                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    rules="required"
                    id="email"
                    info="Le courriel utilisé pour accéder à Résorption-Bidonvilles"
                />

                <div v-if="error" class="bg-red200 p-3 mb-8">
                    {{ error }}
                </div>

                <div class="text-center">
                    <Button
                        type="submit"
                        variant="tertiary"
                        class="mb-4"
                        :loading="loading"
                    >
                        Renouveler mon mot de passe
                    </Button>
                </div>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { requestNewPassword } from "#helpers/api/user";
import { notify } from "#helpers/notificationHelper";

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

                this.$router.push({ path: "/" });
                notify({
                    group: "notifications",
                    type: "success",
                    title: "Renouveller mon mot de passe",
                    text: "Un mail vous a été adressé avec les instructions"
                });
            } catch (err) {
                this.error = err.user_message;
            }
            this.loading = false;
        }
    }
};
</script>
