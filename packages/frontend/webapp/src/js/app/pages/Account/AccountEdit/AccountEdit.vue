<template>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <AccountHeader
            :title="
                $route.params.id
                    ? 'Mise à jour du compte'
                    : 'Mettre à jour mon compte'
            "
            class="bg-G200"
        >
            <div class="flex">
                <Button variant="primaryText" @click="$emit('cancelEdit')"
                    >Annuler</Button
                >
                <Button
                    variant="tertiary"
                    @click="handleSubmit(submit)"
                    :loading="loading"
                    >Valider</Button
                >
            </div>
        </AccountHeader>
        <PrivateContainer>
            <AccountPanel
                :title="
                    $route.params.id
                        ? 'Coordonnées et identifiants'
                        : 'Mes coordonnées et identifiants'
                "
            >
                <AccountReadLabel label="Structure" class="mb-8">
                    <router-link
                        class="text-primary"
                        :to="'/annuaire/' + user.organization.id"
                    >
                        {{ user.organization.name }}</router-link
                    >
                </AccountReadLabel>
                <TextInput
                    label="Nom de famille"
                    id="last_name"
                    v-model="edit.last_name"
                    rules="required"
                    :showMandatoryStar="true"
                />

                <TextInput
                    label="Prénom"
                    id="first_name"
                    rules="required"
                    v-model="edit.first_name"
                    :showMandatoryStar="true"
                />

                <TextInput
                    label="Fonction"
                    rules="required"
                    id="position"
                    v-model="edit.position"
                    :showMandatoryStar="true"
                />

                <TextInput
                    label="Téléphone"
                    :rules="!$route.params.id ? 'required' : ''"
                    id="phone"
                    info="(utilisé sur l'annuaire, il facilite la mise en relation entre acteurs)"
                    v-model="edit.phone"
                    :showMandatoryStar="true"
                />

                <div class="border-t-1 mt-4 pt-4" v-if="!$route.params.id">
                    <PasswordInput
                        label="Votre mot de passe"
                        v-model="edit.password"
                        id="password"
                    />

                    <PasswordInfo>
                        <div>
                            Laissez ce champ vide si vous souhaitez conserver
                            votre mot de passe actuel.
                        </div>
                    </PasswordInfo>
                </div>

                <CheckableGroup
                    label="Je souhaite recevoir par courriel :"
                    direction="vertical"
                    withoutMargin
                >
                    <Checkbox
                        v-for="subscription in Object.keys(EMAIL_SUBSCRIPTIONS)"
                        :key="subscription"
                        :label="EMAIL_SUBSCRIPTIONS[subscription]"
                        :checkValue="subscription"
                        v-model="edit.email_subscriptions"
                    />
                </CheckableGroup>

                <div v-if="error" class="text-error">
                    {{ error }}
                </div>
            </AccountPanel>
        </PrivateContainer>
    </ValidationObserver>
</template>

<script>
import PasswordInfo from "#app/components/LoginLayout/PasswordInfo";
import AccountPanel from "../ui/AccountPanel";
import AccountHeader from "../ui/AccountHeader";
import AccountReadLabel from "../ui/AccountReadLabel";
import PrivateContainer from "#app/components/PrivateLayout/PrivateContainer";
import EMAIL_SUBSCRIPTIONS from "#app/utils/email_subscriptions";

import { edit } from "#helpers/api/user";

export default {
    components: {
        PrivateContainer,
        AccountReadLabel,
        AccountPanel,
        AccountHeader,
        PasswordInfo
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {
                first_name: this.user.first_name || "",
                last_name: this.user.last_name || "",
                position: this.user.position || "",
                phone: this.user.phone || "",
                password: "",
                email_subscriptions: this.user.email_subscriptions
            },
            EMAIL_SUBSCRIPTIONS
        };
    },
    props: {
        user: {
            type: Object
        }
    },
    methods: {
        async submit() {
            this.error = null;
            this.loading = true;

            try {
                await edit(this.edit, this.$route.params.id);
                window.location.reload();
            } catch ({ user_message, fields }) {
                this.error = user_message;
                this.$refs.form.setErrors(fields);
            }
            this.loading = false;
        }
    }
};
</script>
