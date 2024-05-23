<template>
    <div
        v-if="!shantytown.justiceStatuses || !shantytown.justiceStatuses.length"
        class="text-G700"
    >
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
        <ul>
            <li
                class="flex"
                v-for="status in shantytown.justiceStatuses"
                :key="status.label"
            >
                <Icon v-if="status.icon" :icon="status.icon" />
                <img
                    class="w-5 h-4 mt-1"
                    :src="status.img"
                    alt=""
                    v-if="status.img"
                />
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
