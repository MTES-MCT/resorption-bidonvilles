<template>
    <PublicLayout
        :stickyHeader="false"
        :displayLanguagePicker="false"
        class="invitation"
    >
        <div class="bg-corail full-width text-center py-8">
            <div class="mx-6 max-w-3xl md:mx-auto">
                <h1
                    class="text-display-md
                           text-white 
                           md:text-white 
                           md:text-display-lg"
                >
                    {{ $t("invitationPage.title") }}
                </h1>
            </div>
        </div>
        <PublicContainer class="py-4">
            <div class="mx-auto">
                <div class="mx-auto pb-8">
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
            <InvitationCardStack
                v-bind:guestList="guestList"
                @delete-guest="deleteGuest"
            ></InvitationCardStack>
            <div class="flex justify-end space-x-8 mt-8">
                <Button variant="primaryText" :loading="loading" @click="omit">
                    {{ $t("invitationPage.cancel") }}
                </Button>
                <Button
                    variant="primary"
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
import InvitationCardStack from "./InvitationCardStack";

export default {
    components: {
        PublicContainer,
        PublicLayout,
        InvitationForm,
        InvitationCardStack
    },
    data() {
        return {
            guestList: [],
            loading: false
        };
    },
    computed: {
        greeter() {
            return this.$store.state.greeter;
        }
    },
    methods: {
        isEmpty(obj) {
            return Object.keys(obj).length === 0;
        },
        backHomeWithErrMsg(msg) {
            this.$router.push("/");
            notify({
                group: "notifications",
                type: "error",
                title: "Erreur",
                text: msg
            });
        },
        async sendInvitations() {
            this.loading = false;
            if (this.guestList.length > 0) {
                // Préparation de l'objet data à transmettre à l'API
                const data = {
                    // Ajout des destinataires au message de confirmation
                    guests: this.guestList.map(
                        ({ email, firstname, lastname }) => ({
                            email,
                            firstname,
                            lastname
                        })
                    ),
                    greeter: this.greeter
                };
                // Préparation du message de confirmation d'envoi des mails
                const msg = [
                    "Invitation(s) envoyée(s) à",
                    ...this.guestList.map(({ email }) => email)
                ].join("<br/>");
                try {
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
                    this.backHomeWithErrMsg(
                        "Une erreur est survenue lors de l'envoi des invitations."
                    );
                }
            } else {
                this.loading = false;
                this.backHomeWithErrMsg("La liste des invités est vide.");
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
        },
        deleteGuest(index) {
            this.guestList.splice(index, 1);
        }
    },
    created() {
        if (this.greeter === null || this.greeter === undefined) {
            this.backHomeWithErrMsg(
                "Impossible d'identifier l'utilisateur' à l'origine de l'invitation"
            );
        } else if (this.isEmpty(this.greeter)) {
            this.backHomeWithErrMsg(
                "Les données concernant l'utilisateur à l'origine de l'invitation sont introuvables"
            );
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
