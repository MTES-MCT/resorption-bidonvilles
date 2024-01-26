<template>
    <div
        v-if="!shantytown.justiceStatuses || !shantytown.justiceStatuses.length"
        class="text-G600"
    >
        <Icon icon="ban" ariaHidden="true" />&nbsp;
        <template
            v-if="
                shantytown.ownerComplaint === false &&
                shantytown.justiceProcedure === false
            "
            >Aucune procédure judiciaire en cours</template
        >
        <template v-else
            >Aucune information sur les procédures judiciaires</template
        >
    </div>
    <ul v-else>
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

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
