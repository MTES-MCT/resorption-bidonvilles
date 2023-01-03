<template>
    <FicheSousRubrique>
        <p class="font-bold">S'agit-il d'une réinstallation ?</p>
        <p>{{ formatBool(town.isReinstallation) }}</p>
    </FicheSousRubrique>

    <FicheSousRubrique v-if="town.reinstallationComments">
        <p class="font-bold">Précisions sur la réinstallation</p>
        <p class="max-w-3xl break-words whitespace-pre-wrap">
            {{ town.reinstallationComments }}
        </p>
    </FicheSousRubrique>

    <FicheSousRubrique v-if="town.isReinstallation">
        <p class="font-bold">Site(s) d'origine des habitants</p>
        <section
            class="grid grid-cols-2 gap-4 mt-4"
            v-if="town.reinstallationIncomingTowns?.length"
        >
            <article
                v-for="shantytown in town.reinstallationIncomingTowns"
                :key="shantytown.id"
            >
                <div class="flex items-center">
                    <Icon
                        icon="map-marker-alt"
                        class="text-lg"
                        :style="`color: ${shantytown.fieldType.color}`"
                    />
                    <div class="font-bold ml-2 whitespace-nowrap">
                        {{ shantytown.fieldType.label }}
                    </div>
                </div>

                <Link :to="`/site/${shantytown.id}`"
                    >{{ shantytown.usename }}, {{ shantytown.city.name }}</Link
                >
            </article>
        </section>

        <p v-else>Non communiqué</p>
    </FicheSousRubrique>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatBool from "@/utils/formatBool";

import { Link, Icon } from "@resorptionbidonvilles/ui";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
</script>
