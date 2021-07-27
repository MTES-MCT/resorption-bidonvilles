<template>
    <LoginLayout title="Renouveler mon mot de passe">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onLogin)">
                <TextInput
                    label="Votre courriel"
                    v-model="email"
                    :disabled="true"
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
                console.log(this.user);
                this.email = this.user.email;
            } catch (err) {
                console.log(err);
                this.error = err;
            }
        },

        async onSetPassword() {
            setPassword(this.user.id, {
                email: this.user.email,
                password: this.password,
                token: this.$route.params.token
            });
        }
    },
    created() {
        this.load();
    }
};
</script>
