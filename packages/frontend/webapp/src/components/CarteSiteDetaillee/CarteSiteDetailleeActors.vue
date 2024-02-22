<template>
    <span class="sr-only">Liste des intervenants</span>
    <div class="flex">
        <div
            v-bind:class="{
                'text-G700': shantytown.actors.length === 0,
                'text-primary': shantytown.actors.length > 0,
                'font-bold': shantytown.actors.length > 0,
            }"
        >
            <span>
                <Icon icon="user-circle" />
            </span>
        </div>
        <div class="ml-2 flex-grow">
            <span v-if="shantytown.actors.length === 0" class="text-G700">
                Aucun intervenant</span
            >
            <span v-else class="text-primary font-bold"
                >{{ shantytown.actors.length }} intervenant{{
                    shantytown.actors.length > 1 ? "s" : ""
                }}</span
            >
            <ul v-if="shantytown.actors.length > 0" class="text-primary">
                <li v-for="actor in mergedActors" v-bind:key="actor.id">
                    <LinkOrganization
                        :to="`/structure/${actor.id}`"
                        :ariaLabel="`Afficher la fiche de la structure ${actor.name} intervenant sur le site`"
                        >{{ actor.name }}</LinkOrganization
                    >
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";

import { Icon, LinkOrganization } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);

const mergedActors = computed(() => {
    return Object.values(
        shantytown.value.actors.reduce((acc, actor) => {
            if (acc[actor.organization.id] !== undefined) {
                return acc;
            }

            return {
                ...acc,
                [actor.organization.id]: actor.organization,
            };
        }, {})
    );
});
</script>
