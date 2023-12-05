<template>
    <article class="cursor-pointer border-1 hover:border-blue400">
        <RouterLink
            :to="`/structure/${organization.id}`"
            class="inline-block p-4 h-full flex flex-col"
            :class="focusClasses.ring"
        >
            <header>
                <h3 class="text-lg font-bold">{{ name }}</h3>
                <p
                    v-if="
                        organization.abbreviation &&
                        !organization.name.startsWith(organization.type.name)
                    "
                    class="text-sm"
                >
                    {{ organization.name }}
                </p>
                <p class="text-G600">{{ organization.type.name }}</p>
                <p v-if="displayBeingFunded" class="text-info">
                    <Icon icon="euro-sign" /> Structure financée
                </p>
                -
            </header>

            <p class="my-2 text-sm text-G600">
                {{ organization.users.length }} membre{{ plural ? "s" : "" }}
                <template v-if="showWording"
                    >inscrit{{ plural ? "s" : "" }} sur la plateforme</template
                >
            </p>
            <ul class="flex-1">
                <li
                    v-for="user in organization.users.slice(0, 5)"
                    :key="user.id"
                    :class="user.is_admin ? 'text-info' : ''"
                >
                    <IconeAdministrateur v-if="user.is_admin" />
                    <Icon v-else icon="user" title="Pictogramme utilisateur" />
                    {{ user.last_name.toUpperCase() }}
                    {{ user.first_name }}
                </li>
                <li v-if="organization.users.length > 5">
                    et {{ organization.users.length - 5 }} autres personnes
                </li>
            </ul>
            <div class="text-right">
                <Link :to="`/structure/${organization.id}`">
                    <Icon icon="arrow-right" class="mr-1" /> Voir la fiche
                    complète</Link
                >
            </div>
        </RouterLink>
    </article>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useUserStore } from "@/stores/user.store";
import { RouterLink } from "vue-router";
import focusClasses from "@common/utils/focus_classes";

import { Icon, Link } from "@resorptionbidonvilles/ui";
import IconeAdministrateur from "@/components/IconeAdministrateur/IconeAdministrateur.vue";

const props = defineProps({
    organization: Object,
    showWording: {
        type: Boolean,
        required: false,
        default: true,
    },
});
const { organization, showWording } = toRefs(props);

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
