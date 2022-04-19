<template>
    <LoginLayout title="Renouveler mon mot de passe" backTo="home">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSetPassword)">
                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    :disabled="true"
                    rules="required"
                    id="email"
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
                        Renouveler mon mot de passe
                    </Button>
                </div>
            </form>
        </ValidationObserver>
    </LoginLayout>
</template>

<script>
import LoginLayout from "#app/components/LoginLayout";
import { checkPasswordToken, setPassword } from "#helpers/api/user";
import PasswordInfo from "#app/components/LoginLayout/PasswordInfo";
import { notify } from "#helpers/notificationHelper";

export default {
    components: {
        PasswordInfo,
        LoginLayout
    },
    data() {
        return {
            user: null,
            email: "",
            password: "",
            error: null,
            loading: null
        };
    },
    methods: {
        async load() {
            try {
                this.user = await checkPasswordToken(this.$route.params.token);
                this.email = this.user.email;
            } catch (err) {
                this.error = err.user_message;
            }
        },

        async onSetPassword() {
            this.loading = true;

            try {
                await setPassword(this.user.id, {
                    email: this.user.email,
                    password: this.password,
                    token: this.$route.params.token
                });
                this.$router.push({ path: "/connexion" });
                notify({
                    group: "notifications",
                    type: "success",
                    title: "Changer de mot de passe",
                    text: "Votre nouveau mot de passe a été changé"
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
