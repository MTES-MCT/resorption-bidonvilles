<template>
    <span class="sr-only">Phases préparatoires à la résorption du site</span>
    <ul v-if="shantytown.livingConditions.version === 2">
        <div class="mb-1 font-bold -ml-5 whitespace-nowrap">
            Démarche de résorption
        </div>
        <li
            v-for="phase in shantytown.preparatoryPhasesTowardResorption"
            :key="phase.preparatoryPhaseId"
            class="flex items-center"
        >
            <span
                :class="[
                    'flex rounded-full text-xs mr-1 h-6 w-6 items-center justify-center text-primary',
                ]"
                style="padding: 0.2em"
                ariaHidden="true"
            >
                <Icon
                    v-if="phase.completedAt"
                    icon="fa-sharp-duotone fa-solid fa-check"
                />
                <Icon
                    v-else
                    icon="fa-sharp-duotone fa-solid fa-hourglass-half"
                />
            </span>
            <div>
                {{ phase.preparatoryPhaseName }}
            </div>
        </li>
    </ul>
    <div v-else>
        <Tag variant="pin_red"
            >Les conditions de vie évoluent : mettez les à jour !</Tag
        >
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

import { Icon, Tag } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
