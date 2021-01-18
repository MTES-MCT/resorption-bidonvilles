<template>
    <PublicLayout
        :stickyHeader="false"
        :displayLanguagePicker="false"
        class="invitation"
    >
        <div class="bg-corail full-width text-center py-8">
            <div class="max-w-3xl mx-auto">
                <h1 class="text-display-lg text-white ">
                    {{ $t("invitationPage.title") }}
                </h1>
            </div>
        </div>
        <PublicContainer class="py-4">
            <div class="max-w-xl mx-auto">
                <div class="max-w-screen-lg mx-auto pb-8">
                    <div class="mt-8">
                        <span class="font-bold">{{
                            $t("invitationPage.firstParagraph.bold")
                        }}</span>
                        {{ $t("invitationPage.firstParagraph.normal") }}
                        <span>{{
                            $t("invitationPage.secondParagraph.normal")
                        }}</span>
                    </div>
                </div>
            </div>
            <InvitationForm
                v-on:addGuestReq="addGuestToList($event)"
            ></InvitationForm>
            <InvitationList v-bind:guestList="guestList"></InvitationList>
            <div class="flex justify-end space-x-8">
                <Button variant="primaryText" @click="omit">{{
                    $t("invitationPage.cancel")
                }}</Button>
                <Button
                    variant="primary"
                    size="lg"
                    :loading="loading"
                    v-if="this.guestList.length > 0"
                    @click="sendInvitations"
                    >{{ $t("invitationPage.invite") }}
                </Button>
            </div>
        </PublicContainer>
    </PublicLayout>
</template>

<script>
import { invite } from "#helpers/api/invite";
import { notify } from "#helpers/notificationHelper";
import PublicLayout from "#app/components/PublicLayout/index.vue";
import PublicContainer from "#app/components/PublicLayout/PublicContainer.vue";
import InvitationForm from "./InvitationForm.vue";
import InvitationList from "./InvitationList";

export default {
    components: {
        PublicContainer,
        PublicLayout,
        InvitationForm,
        InvitationList
    },
    data() {
        return {
            guestList: [],
            loading: false,
            error: null
        };
    },
    computed: {
        isFrenchLocale() {
            return this.$i18n.locale === "fr";
        },
        greeter() {
            return this.$store.state.greeter;
        }
    },
    methods: {
        async sendInvitations() {
            // Préparation du message de confirmation d'envoi des mails
            let msg = "Invitation(s) envoyée(s) à :<br>";
            // Préparation de l'objet data à transmettre à l'API
            const data = {
                guests: [],
                greeter: this.greeter
            };
            this.loading = true;
            // Ajout des destinataires au message de confirmation
            for (const guest of this.guestList) {
                data.guests.push({
                    email: guest.email,
                    first_name: guest.firstname,
                    last_name: guest.lastname
                });
                msg += guest.email + "<br>";
            }

            try {
                this.loading = true;
                await invite(data);
                this.loading = false;
                this.$router.push("/");
                notify({
                    group: "notifications",
                    type: "success",
                    title: "Succès",
                    text: msg
                });
            } catch (err) {
                this.loading = false;
                this.error = err;
                this.$refs.form.setErrors(err.fields);
            }
        },
        omit() {
            this.loading = false;
            this.$router.push("/");
            notify({
                group: "notifications",
                type: "success",
                title: "Merci !",
                text: "A bientôt."
            });
        },
        addGuestToList(guest) {
            this.guestList.push({
                firstname: guest.firstname,
                lastname: guest.lastname,
                email: guest.email
            });
        }
    }
};
</script>

<style lang="scss">
.contact {
    .autocompleter-textfield input:focus {
        @apply border-primary;
    }
}
</style>
