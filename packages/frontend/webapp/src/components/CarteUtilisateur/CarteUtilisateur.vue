<template>
    <CarteUtilisateurWrapper
        :user="user"
        :linkToUser="linkToUser"
        class="border p-4 grid grid-cols-2 gap-8"
        :class="{
            'hover:bg-blue200': userStore.hasPermission('user.read'),
            'bg-blue100': user.is_admin,
        }"
    >
        <div>
            <h1 class="font-bold" :class="user.is_admin ? 'text-info' : ''">
                {{ user.last_name.toUpperCase() }}
                {{ user.first_name }}
            </h1>
            <p>{{ user.position }}</p>
            <p class="mt-2">
                <span class="text-G500 text-sm">Rôle sur la plateforme :</span
                ><br />
                <span :class="user.is_admin ? 'text-info' : ''"
                    ><Icon icon="user-shield" v-if="user.is_admin" />
                    {{ user.role }}</span
                >
            </p>
        </div>
        <div>
            <CarteUtilisateurDetailsIcon icon="envelope">
                <Link :to="`mailto:${user.email}`" @click="trackEmail">{{
                    user.email
                }}</Link>
            </CarteUtilisateurDetailsIcon>
            <CarteUtilisateurDetailsIcon v-if="user.phone" icon="phone">{{
                user.phone
            }}</CarteUtilisateurDetailsIcon>
        </div>
    </CarteUtilisateurWrapper>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import { trackEvent } from "@/helpers/matomo";
import { useUserStore } from "@/stores/user.store";
import { Icon, Link } from "@resorptionbidonvilles/ui";
import CarteUtilisateurWrapper from "./CarteUtilisateurWrapper.vue";
import CarteUtilisateurDetailsIcon from "./CarteUtilisateurDetailsIcon.vue";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    linkToUser: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { user, linkToUser } = toRefs(props);
const userStore = useUserStore();

function trackEmail(event) {
    event.stopPropagation();
    trackEvent("Mail", "Envoi mail entre utilisateurs");
}
</script>
