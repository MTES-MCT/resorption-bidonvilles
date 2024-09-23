<template>
    <div class="relative h-full">
        <InputCoordinatesTooltip />
        <Carto
            :defaultView="{ center: view, zoom: DEFAULT_ZOOM }"
            ref="carto"
            :layers="['Dessin', 'Satellite']"
            defaultLayer="Dessin"
            :isLoading="isSubmitting"
            displaySkipMapLinks
        />
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, watch, ref } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import Carto from "@/components/Carto/Carto.vue";
import marqueurInput from "@/utils/marqueurInput";
import InputCoordinatesTooltip from "./InputCoordinatesTooltip.vue";

const DEFAULT_ZOOM = 14;
const carto = ref(null);
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
const { name } = toRefs(props);
const isSubmitting = useIsSubmitting();
const { value, handleChange } = useField(name.value);

watch(value, () => {
    if (value.value) {
        refreshInput(value.value, false);
    }
});

const view = computed(() => {
    if (!value.value) {
        return;
    }

    return value.value;
});

const inputMarker = marqueurInput(value.value);
let clickTimeout = null;

function refreshInput(center, emitInput = true) {
    if (isSubmitting.value === true) {
        return;
    }

    inputMarker.setLatLng(center);
    carto.value.setView({ center });

    if (emitInput === true) {
        handleChange(center);
    }
}

function handleClick({ latlng: { lat, lng } }) {
    console.log("handleClick", lat, lng);

    refreshInput([lat, lng]);
    clearTimeout(clickTimeout);
    clickTimeout = null;
}

watch(carto, () => {
    console.log("carto", carto.value);

    if (carto.value) {
        const { map } = carto.value;
        inputMarker.addTo(map);
        inputMarker.addEventListener("dragend", () => {
            const { lat, lng } = inputMarker.getLatLng();
            refreshInput([lat, lng]);
        });

        map.on("click", (event) => {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(handleClick.bind(this, event), 200);
        });
        map.on("dblclick", () => {
            clearTimeout(clickTimeout);
            clickTimeout = null;
        });
    }
});
</script>
