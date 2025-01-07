<template>
    <div
        v-if="!shantytown.justiceStatuses || !shantytown.justiceStatuses.length"
        class="pl-5 text-G700"
    >
        <div class="mb-1 font-bold -ml-5 whitespace-nowrap">Procédures</div>
        <Icon icon="ban" />&nbsp;
        <template
            v-if="
                shantytown.ownerComplaint === false &&
                shantytown.justiceProcedure === false
            "
            >Aucune procédure judiciaire ou administrative en cours</template
        >
        <template v-else
            >Aucune information sur les procédures judiciaires ou
            administratives</template
        >
    </div>
    <template v-else>
        <span class="sr-only"
            >Statut des procédures judiciaires ou administratives</span
        >
        <ul class="pl-5">
            <div class="mb-1 font-bold -ml-5 whitespace-nowrap">Procédures</div>
            <li
                class="flex items-center"
                v-for="status in shantytown.justiceStatuses"
                :key="status.label"
            >
                <span
                    :class="[
                        'flex rounded-full text-xs border-2 mr-1 mb-1 h-6 w-6 items-center justify-center',
                        colorClass,
                    ]"
                    style="padding: 0.2em"
                    ariaHidden="true"
                >
                    <Icon v-if="status.icon" :icon="status.icon" />
                </span>
                <div class="ml-2">
                    <span class="font-bold">{{ status.label }}</span>
                    <span v-if="status.date" class="secondary">
                        le
                        {{ formatDate(status.date, "d/m/y") }}</span
                    >
                </div>
            </li>
        </ul>
    </template>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
