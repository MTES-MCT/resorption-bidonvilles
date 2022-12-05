<template>
    <div
        v-if="!shantytown.justiceStatuses || !shantytown.justiceStatuses.length"
        class="text-G600"
    >
        <Icon icon="ban" />&nbsp;
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
    <div v-else>
        <div
            class="flex"
            v-for="status in shantytown.justiceStatuses"
            :key="status.label"
        >
            <Icon v-if="status.icon" :icon="status.icon" />
            <img class="w-5 h-4 mt-1" :src="status.img" v-if="status.img" />
            <div class="ml-2">
                <span class="font-bold">{{ status.label }}</span>
                <span v-if="status.date" class="secondary">
                    le
                    {{ formatDate(status.date, "d/m/y") }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs } from "vue";
import formatDate from "@/utils/formatDate";

import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
