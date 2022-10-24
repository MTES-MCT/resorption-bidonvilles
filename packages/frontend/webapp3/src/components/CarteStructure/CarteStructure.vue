<template>
    <article
        class="cursor-pointer border-1"
        :class="isHover ? 'border-blue400' : ''"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
    >
        <RouterLink
            :to="`/structure/${organization.id}`"
            class="inline-block p-4 h-full flex flex-col"
        >
            <header>
                <h1 class="text-lg font-bold">{{ name }}</h1>
                <h2
                    v-if="
                        organization.abbreviation &&
                        !organization.name.startsWith(organization.type.name)
                    "
                    class="text-sm"
                >
                    {{ organization.name }}
                </h2>
                <h2 class="text-G500">{{ organization.type.name }}</h2>
                <p v-if="displayBeingFunded" class="text-info">
                    <Icon icon="euro-sign" /> Structure financée
                </p>
            </header>

            <p class="mt-4 text-sm text-G500">
                {{ organization.users.length }} membre{{
                    plural ? "s" : ""
                }}
                inscrit{{ plural ? "s" : "" }} sur la plateforme
            </p>
            <ul class="flex-1">
                <li
                    v-for="user in organization.users.slice(0, 5)"
                    :key="user.id"
                    :class="user.is_admin ? 'text-info' : ''"
                >
                    <Icon :icon="user.is_admin ? 'user-shield' : 'user'" />
                    {{ user.last_name.toUpperCase() }}
                    {{ user.first_name }}
                </li>
                <li v-if="organization.users.length > 5">
                    et {{ organization.users.length - 5 }} autres personnes
                </li>
            </ul>
            <div class="text-right">
                <Button
                    variant="primaryText"
                    icon="arrow-right"
                    :class="[
                        'text-display-sm font-bold whitespace-no-wrap hover:underline -mb-4',
                    ]"
                    >{{ isHover ? "Voir la fiche complète" : "" }}</Button
                >
            </div>
        </RouterLink>
    </article>
</template>

<script setup>
import { defineProps, toRefs, ref, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { RouterLink } from "vue-router";
import { Button, Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    organization: {
        type: Object,
        required: true,
    },
});
const { organization } = toRefs(props);
const isHover = ref(false);

const userStore = useUserStore();
const name = computed(() => {
    const title = organization.value.abbreviation || organization.value.name;
    // Only display territory for associations
    if (organization.value.type.category === "association") {
        return `${title} – ${organization.value.location_name}`;
    }

    if (organization.value.location.type === "nation") {
        return title;
    }

    return title.replace("-", "–");
});
const displayBeingFunded = computed(() => {
    return userStore.user?.is_superuser && organization.value.being_funded;
});
const plural = computed(() => {
    return organization.value.users.length > 1;
});
</script>
