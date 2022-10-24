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
        Territoire d'intervention :<br /><span class="font-bold">{{
            user.location_name
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
    <Button
        class="mt-2"
        v-if="userStore.user?.is_superuser"
        size="sm"
        icon="user-pen"
        iconPosition="left"
        :href="`/utilisateur/${user.id}`"
        >Modifier ces informations</Button
    >
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import avatarImg from "@/assets/img/illustrations/avatar.svg";
import {
    Button,
    Icon,
    Link,
    LinkOrganization,
} from "@resorptionbidonvilles/ui";
import { trackEvent } from "@/helpers/matomo";

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

function trackEmail() {
    trackEvent("Mail", "Envoi mail entre utilisateurs");
}
</script>
