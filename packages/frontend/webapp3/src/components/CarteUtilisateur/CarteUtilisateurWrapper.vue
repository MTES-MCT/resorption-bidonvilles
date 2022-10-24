<template>
    <RouterLink :to="to" v-if="hasLinkPermission">
        <slot />
    </RouterLink>
    <div v-else>
        <slot />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user.store";

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

const hasLinkPermission = computed(() => {
    if (linkToUser.value !== true) {
        return true;
    }

    return userStore.hasPermission("user.read");
});

const to = computed(() => {
    if (linkToUser.value === true) {
        return `/acces/${user.value.id}`;
    }

    return `/structure/${user.value.organization.id}`;
});
</script>
