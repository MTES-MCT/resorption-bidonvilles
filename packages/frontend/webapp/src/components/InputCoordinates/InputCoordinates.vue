<template>
    <div class="relative h-full">
        <InputCoordinatesTooltip />
        <Carte
            withInput
            v-model="modelValue"
            :defaultView="{ center: view, zoom: DEFAULT_ZOOM }"
            ref="map"
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, watch, ref } from "vue";
import { useField } from "vee-validate";
import Carte from "@/components/Carte/Carte.vue";
import InputCoordinatesTooltip from "./InputCoordinatesTooltip.vue";

const DEFAULT_ZOOM = 14;
const map = ref(null);
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
const { name } = toRefs(props);
const { value, handleChange } = useField(name.value);

let changeComingFromMap = false;
const modelValue = computed({
    get() {
        return value.value;
    },
    set(v) {
        changeComingFromMap = true;
        handleChange(v);
    },
});

const view = computed(() => {
    if (!modelValue.value) {
        return;
    }

    return modelValue.value;
});

watch(modelValue, () => {
    if (!view.value) {
        changeComingFromMap = false;
        return;
    }

    map.value.setView({
        center: view.value,
        zoom: changeComingFromMap ? undefined : DEFAULT_ZOOM,
    });
    changeComingFromMap = false;
});
</script>
