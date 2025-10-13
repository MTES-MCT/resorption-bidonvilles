<template>
    <div class="text-md px-6">
        <div class="text-primary text-display-md font-bold">
            <span class="font-bold">
                {{ shantytown.addressSimple }}
                <span v-if="shantytown.name">« {{ shantytown.name }} » </span>
            </span>
            <span class="font-normal">
                {{ shantytown.city.name }}
            </span>
        </div>
    </div>
    <div class="px-6" v-if="isClosed(shantytown)">
        Fermé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
    </div>
    <div class="px-6" v-else-if="isSolved(shantytown)">
        Résorbé le {{ formatDate(shantytown.closedAt, "d/m/y") }}
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import formatDate from "@common/utils/formatDate.js";
import isSolved from "@/utils/isShantytownResorbed";
import isClosed from "@/utils/isShantytownClosed";

const props = defineProps({
    shantytown: Object,
});
const { shantytown } = toRefs(props);
</script>
