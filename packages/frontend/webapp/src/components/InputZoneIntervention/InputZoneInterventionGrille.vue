<template>
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-4 gap-2"
    >
        <InputZoneInterventionCarte
            v-for="(area, index) in areas"
            :key="`${area.type}-${area.code}`"
            :area="area"
            @remove="() => emit('remove', area, index)"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import InputZoneInterventionCarte from "./InputZoneInterventionCarte.vue";

const props = defineProps({
    areas: {
        type: Array,
        required: true,
    },
});
const { areas } = toRefs(props);
const emit = defineEmits(["remove"]);
</script>
