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
                <p
                    class="mt-3 text-G600"
                    v-if="organization.intervention_areas.areas.length > 1"
                >
                    <span class="font-bold">Territoires d'intervention :</span>
                    {{
                        organization.intervention_areas.areas
                            .filter((area) => area.is_main_area === true)
                            .map((area) => area[area.type].name)
                            .join(", ")
                    }}
                </p>
                -
            </header>

            <p class="my-2 text-sm text-G600">
                {{ organization.users.length }} membre{{ plural ? "s" : "" }}
                <template v-if="showWording">
                    inscrit{{ plural ? "s" : "" }} sur la plateforme
                    <span
                        class="text-primary"
                        v-if="directoryStore.filters.expertiseTopics.length > 0"
                    >
                        correspondant aux critères de compétences</span
                    >
                </template>
            </p>
            <ul
                :class="
                    directoryStore.filters.expertiseTopics.length > 0
                        ? 'flex-1 mb-4'
                        : 'flex-1'
                "
            >
                <template
                    v-if="directoryStore.filters.expertiseTopics.length > 0"
                >
                    <li
                        v-for="user in organization.users"
                        :key="user.id"
                        :class="user.is_admin ? 'text-info' : ''"
                    >
                        <IconeAdministrateur v-if="user.is_admin" />
                        <IconeSimpleUtilisateur v-else />&nbsp;
                        <span class="font-bold">
                            {{ user.last_name.toUpperCase() }}
                            {{ user.first_name }}
                        </span>
                        <div class="ml-8 text-G600 flex w-full">
                            <Icon
                                icon="arrow-turn-down-right"
                                class="text-info mr-2"
                            />

                            <div
                                class="flex-1 w-half"
                                v-if="
                                    getUserFilteredExpertiseTopics(
                                        user,
                                        'expertise'
                                    ).length > 0
                                "
                            >
                                <span class="text-info"> Expert(e) en </span>
                                <ul>
                                    <li
                                        class="ml-2 text-sm"
                                        v-for="topic in getUserFilteredExpertiseTopics(
                                            user,
                                            'expertise'
                                        )"
                                        :key="topic.uid"
                                    >
                                        - {{ topic.label }}
                                    </li>
                                </ul>
                            </div>
                            <div
                                class="flex-1 w-half"
                                v-if="
                                    getUserFilteredExpertiseTopics(
                                        user,
                                        'interest'
                                    ).length > 0
                                "
                            >
                                <span class="text-info"> Intéressé(e) par</span>
                                <ul>
                                    <li
                                        class="ml-2 text-sm"
                                        v-for="topic in getUserFilteredExpertiseTopics(
                                            user,
                                            'interest'
                                        )"
                                        :key="topic.uid"
                                    >
                                        - {{ topic.label }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </template>

                <template v-else>
                    <li
                        v-for="user in organization.users.slice(0, 5)"
                        :key="user.id"
                        :class="user.is_admin ? 'text-info' : ''"
                    >
                        <IconeAdministrateur v-if="user.is_admin" />
                        <IconeSimpleUtilisateur v-else />
                        {{ user.last_name.toUpperCase() }}
                        {{ user.first_name }}
                    </li>
                    <li v-if="organization.users.length > 5">
                        et {{ organization.users.length - 5 }} autres personnes
                    </li>
                </template>
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
import IconeSimpleUtilisateur from "@/components/IconeSimpleUtilisateur/IconeSimpleUtilisateur.vue";
import { useDirectoryStore } from "@/stores/directory.store";

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
const directoryStore = useDirectoryStore();

const name = computed(() => {
    const title = organization.value.abbreviation || organization.value.name;
    // Only display territory for associations
    if (organization.value.type.category === "association") {
        return `${title} – ${organization.value.location_name}`;
    }

    if (organization.value.intervention_areas.is_national) {
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

function getUserFilteredExpertiseTopics(user, topicLevel) {
    return (user.expertise_topics || []).filter((topic) => {
        return (
            directoryStore.filters.expertiseTopics.includes(topic.uid) &&
            topic.type == topicLevel
        );
    });
}
</script>
-
