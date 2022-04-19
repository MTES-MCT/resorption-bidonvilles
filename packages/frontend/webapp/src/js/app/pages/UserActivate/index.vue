<template>
    <LoginLayout title="Activer mon compte" backTo="home">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onActivate)">
                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    rules="required"
                    id="email"
                    :disabled="true"
                />

                <PasswordInput
                    label="Votre mot de passe"
                    v-model="password"
                    rules="required"
                    id="password"
                />

                <PasswordInfo />

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
                        Activer mon compte
                    </Button>
                </div>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { checkActivationToken, activate } from "#helpers/api/user";
import PasswordInfo from "#app/components/LoginLayout/PasswordInfo";
import { notify } from "#helpers/notificationHelper";

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
        async load() {
            try {
                this.user = await checkActivationToken(
                    this.$route.params.token
                );
                this.email = this.user.email;
            } catch (err) {
                this.error = err.user_message;
            }
        },
        async onActivate() {
            try {
                this.error = null;
                this.loading = true;
                await activate(this.user.id, {
                    email: this.user.email,
                    password: this.password,
                    token: this.$route.params.token
                });
                this.$trackMatomoEvent("Demande d'accès", "Création compte");

                const d = new Date();
                d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // cookie is valid for 365 days
                document.cookie = `logged_once=1;expires={d.toUTCString()};path=/`;

                this.$router.push({ path: "/" });
                notify({
                    group: "notifications",
                    type: "success",
                    title: "Compte activé",
                    text: "Vous pouvez désormais vous connecter à la plateforme"
                });
            } catch (err) {
                this.error = err.user_message;
                if (err.fields) {
                    this.$refs.form.setErrors(err.fields);
                }
            }
            this.loading = false;
        }
    },
    created() {
        this.load();
    }
};
</script>
