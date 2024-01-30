<template>
    <FormPublic
        :schema="schema"
        :submit="addGuest"
        size="large"
        ref="form"
        :showErrorSummary="false"
    >
        <template v-slot:subtitle
            >Vous connaissez des personnes impliquées dans la résorption des
            bidonvilles ?</template
        >
        <template v-slot:title
            >Invitez-les à découvrir la plateforme !</template
        >

        <template v-slot:body>
            <p class="mb-6">
                <strong class="font-bold"
                    >En invitant vos contacts, vous participez au développement
                    de la communauté d'utilisateurs</strong
                >
                et à la création d'une véritable dynamique pour résorber les
                bidonvilles. Merci à vous !<br /><em class="italic"
                    >Un email sera envoyé aux personnes indiquées et leurs
                    coordonnées seront utilisées exclusivement par l'équipe de
                    Résorption-Bidonvilles.</em
                >
            </p>
            <div
                class="flex flex-col md:flex-row md: justify-center md:space-x-3 lg:space-x-8"
            >
                <FormInvitationInputFirstName
                    class="flex-1"
                    :disabled="isLoading"
                />
                <FormInvitationInputLastName
                    class="flex-1"
                    :disabled="isLoading"
                />
                <FormInvitationInputEmail
                    class="flex-1"
                    :disabled="isLoading"
                />
            </div>
        </template>

        <template v-slot:button>
            <p
                class="flex flex-col items-center space-y-2 lg:flex-row-reverse lg:space-y-0"
            >
                <Button type="submit" class="ml-2" :loading="isLoading"
                    >Ajouter ce contact</Button
                >
                <Button
                    type="button"
                    variant="primaryOutline"
                    class="ml-2"
                    v-if="guests.length === 0 && showSkip"
                    @click="backHome"
                    >Ignorer cette étape</Button
                >
            </p>
        </template>
    </FormPublic>

    <div class="mt-6" v-if="guests.length > 0">
        <h1 class="text-center text-lg sm:text-xl md: text-primary mb-2">
            Liste des personnes qui recevront l'invitation
        </h1>

        <ContentWrapper
            size="medium"
            class="flex flex-col items-center space-y-4"
        >
            <section class="flex flex-col space-y-4">
                <FormInvitationInvite
                    v-for="(guest, index) in guests"
                    :key="guest.email"
                    v-bind="guest"
                    @remove="removeGuest(index)"
                />
            </section>
            <Button type="button" @click="sendInvitations" :loading="isLoading"
                >Envoyer les invitations</Button
            >
        </ContentWrapper>
    </div>
</template>

<script setup>
// utils
import { defineProps, toRefs, ref } from "vue";
import schema from "./FormInvitation.schema.js";
import router from "@/helpers/router";
import { useNotificationStore } from "@/stores/notification.store";
import { create } from "@/api/invitations.api.js";

// components
import { Button, ContentWrapper } from "@resorptionbidonvilles/ui";
import FormPublic from "@/components/FormPublic/FormPublic.vue";
import FormInvitationInputEmail from "./inputs/FormInvitationInputEmail.vue";
import FormInvitationInputFirstName from "./inputs/FormInvitationInputFirstName.vue";
import FormInvitationInputLastName from "./inputs/FormInvitationInputLastName.vue";
import FormInvitationInvite from "./FormInvitationInvite.vue";

const props = defineProps({
    greeter: {
        type: Object, // un objet avec trois clés : email, first_name, et last_name
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    showSkip: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { greeter, from, showSkip } = toRefs(props);
const guests = ref([]);
const form = ref(null);
const isLoading = ref(false);

function addGuest(guest) {
    if (guests.value.some(({ email }) => email === guest.email)) {
        throw {
            user_message:
                "Cet email fait déjà partie de la liste des invité(e)s",
        };
    }

    guests.value.push(guest);
    form.value.resetForm();
}

function removeGuest(index) {
    guests.value.splice(index, 1);
}

function backHome() {
    const notificationStore = useNotificationStore();
    router.push("/");
    notificationStore.info("Merci", "À bientôt !");
}

async function sendInvitations() {
    if (isLoading.value === true) {
        return;
    }

    if (guests.value.length < 1) {
        throw new Error("");
    }

    isLoading.value = true;
    try {
        const notificationStore = useNotificationStore();
        await create({
            guests: guests.value,
            greeter: greeter.value,
            invite_from: from.value,
        });
        notificationStore.success(
            "Invitations envoyées",
            "Merci pour votre partage !"
        );
        router.push("/");
    } catch (e) {
        form.value.setError(
            e?.user_message || "Une erreur inconnue est survenue"
        );
    }
    isLoading.value = false;
}
</script>
