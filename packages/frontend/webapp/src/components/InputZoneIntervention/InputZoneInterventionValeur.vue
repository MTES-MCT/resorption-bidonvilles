<template>
    <div
        class="w-full border-dashed border-2 border-G500"
        :class="{
            'h-48 cursor-pointer': areas.length === 0,
            'min-h-48': areas.length > 0,
        }"
        @click="handleClick"
    >
        <InputZoneInterventionVide v-if="areas.length === 0" />
        <InputZoneInterventionGrille
            v-else
            :areas="areas"
            @remove="removeArea"
        />
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import InputZoneInterventionVide from "./InputZoneInterventionVide.vue";
import InputZoneInterventionGrille from "./InputZoneInterventionGrille.vue";

const props = defineProps({
    areas: {
        type: Array,
        required: true,
    },
});
const { areas } = toRefs(props);
const emit = defineEmits(["focusAutocomplete", "remove"]);

function handleClick() {
    if (areas.value.length === 0) {
        emit("focusAutocomplete");
    }
}

function removeArea(area, index) {
    emit("remove", area, index);
}
</script>
