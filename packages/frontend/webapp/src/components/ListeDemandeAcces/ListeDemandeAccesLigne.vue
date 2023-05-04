<template>
    <RouterLink
        as="div"
        class="cursor-pointer hover:bg-blue100"
        :class="bgColor"
        :to="`/acces/${user.id}`"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
    >
        <div class="flex items-start">
            <p :class="accessStatus.textColor">
                <Icon :icon="accessStatus.icon" class="mr-1" />
            </p>
            <p>
                <span class="font-bold" :class="accessStatus.textColor">{{
                    accessStatus.label
                }}</span
                ><br />
                <span class="text-sm" v-if="accessStatus.date"
                    >le {{ formatDate(accessStatus.date, "d M y") }}</span
                >
            </p>
        </div>
        <div>
            <p>{{ user.last_name.toUpperCase() }} {{ user.first_name }}</p>
            <p class="text-sm">{{ user.position }}</p>
            <p
                class="text-sm text-G600"
                v-if="user.last_access && userStore.user?.is_superuser"
            >
                Dernière connexion: {{ formatDate(user.last_access, "d M y") }}
            </p>
        </div>
        <div>
            <p>
                {{ user.organization.abbreviation || user.organization.name }}
            </p>
        </div>
        <div>{{ user.location_name }}</div>
        <div>
            <p>{{ user.role }}</p>
            <br />
            <p class="text-right text-primary">
                <Link v-if="hovered" :to="`/acces/${user.id}`"
                    >Voir la demande d'accès</Link
                >
                <Icon icon="arrow-right" class="ml-2" />
            </p>
        </div>
    </RouterLink>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import accessStatuses from "@/utils/access_statuses";
import formatDate from "@common/utils/formatDate.js";

import { Icon, Link } from "@resorptionbidonvilles/ui";

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    odd: {
        // indique si la ligne est en position impaire ou non (utilisée pour le style de la ligne)
        type: Boolean,
        required: false,
    },
});

const { user, odd } = toRefs(props);
const userStore = useUserStore();
const hovered = ref(false);
const accessStatus = computed(() => {
    return {
        ...user.value.access_status,
        ...accessStatuses[user.value.access_status.status],
    };
});
const bgColor = computed(() => {
    if (accessStatus.value.bgColor) {
        return accessStatus.value.bgColor[odd.value ? "odd" : "even"];
    }

    return odd.value ? "bg-G100" : "";
});
</script>
