<template>
    <header class="flex items-start justify-between">
        <h1>
            <span class="font-bold text-3xl"
                >{{ user.last_name.toUpperCase() }} </span
            ><br /><span class="text-lg">{{ user.first_name }}</span>
        </h1>
        <img :src="avatarImg" class="w-24" />
    </header>
    <p>
        Structure :<br />
        <LinkOrganization :to="`/structure/${user.organization.id}`">{{
            organizationLabel
        }}</LinkOrganization>
    </p>
    <p class="mt-2">
        Territoire(s) d'intervention :<br /><span class="font-bold">{{
            interventionAreas?.main.join(", ")
        }}</span>
    </p>
    <p class="mt-2" v-if="interventionAreas?.additionnal.length > 0">
        Territoire étendu :<br /><span class="font-bold">{{
            interventionAreas?.additionnal.join(", ")
        }}</span>
    </p>
    <p class="mt-2">
        Fonction :<br /><span class="font-bold">{{ user.position }}</span>
    </p>
    <p class="mt-2">
        <Icon icon="envelope" class="text-G400 mr-2" />
        <Link :to="`mailto:${user.email}`" @click="trackEmail">{{
            user.email
        }}</Link
        ><br />
        <Icon icon="phone" class="text-G400 mr-2" /> {{ phone }}
    </p>
    <DsfrButton
        class="mt-2"
        v-if="userStore.user?.is_superuser && !user.anonymized_at"
        size="sm"
        icon="mdi-account-edit"
        @click.prevent.stop="router.push(`/utilisateur/${user.id}`)"
        >Modifier ces informations</DsfrButton
    >
    <DsfrButton
        v-if="userStore.user?.is_superuser && !user.anonymized_at"
        class="mt-2"
        size="sm"
        icon="fr-icon-hotel-line"
        @click.prevent.stop="router.push(`/utilisateur/${user.id}/territoires`)"
        >Modifier le(s) territoire(s) d'intervention</DsfrButton
    >
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import avatarImg from "@/assets/img/illustrations/avatar.svg";
import { Icon, Link, LinkOrganization } from "@resorptionbidonvilles/ui";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});
const { user } = toRefs(props);
const userStore = useUserStore();

const organizationLabel = computed(() => {
    const { abbreviation, name } = user.value.organization;
    if (abbreviation) {
        return abbreviation;
    }

    return name;
});
const phone = computed(() => {
    if (!user.value.phone) {
        return "Non communiqué";
    }

    return user.value.phone;
});
const interventionAreas = computed(() => {
    return user.value.intervention_areas.areas.reduce(
        (acc, area) => {
            acc[area.is_main_area ? "main" : "additionnal"].push(
                computeAreaName(area)
            );
            return acc;
        },
        {
            main: [],
            additionnal: [],
        }
    );
});

function computeAreaName(area) {
    if (area.type === "nation") {
        return "National";
    }

    return area[area.type].name;
}

function trackEmail() {
    trackEvent("Mail", "Envoi mail entre utilisateurs");
}
</script>
