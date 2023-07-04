<template>
    <tr
        class="text-right hover:bg-blue200 cursor-pointer"
        :class="even ? 'bg-G100' : 'bg-G200'"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <td></td>
        <td class="text-left py-1">
            <CommuneBodyCell :data="data" :town="town" />
        </td>
        <td
            v-for="col in columns"
            class="font-normal align-top py-1"
            :key="col.uid"
        >
            <component :is="col.bodyComponent" :data="data" :town="town" />
        </td>
        <td
            class="align-top py-1 text-center text-blue400 hover:text-primary"
            @click.stop="$emit('townZoom', town, data.city)"
        >
            <Icon icon="magnifying-glass-plus" />
        </td>
    </tr>
</template>

<script setup>
import { toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";
import CommuneBodyCell from "../cells/Commune/CommuneBody.vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    town: {
        type: Object,
        required: true,
    },
    even: {
        type: Boolean,
        required: false,
        default: false,
    },
});
const { data, columns, town, even } = toRefs(props);
const emit = defineEmits(["townZoom", "highlightTown", "unhighlightTown"]);

function onMouseEnter() {
    emit("highlightTown", town.value.id, data.value.city.code);
}

function onMouseLeave() {
    emit("unhighlightTown", town.value.id, data.value.city.code);
}
</script>
