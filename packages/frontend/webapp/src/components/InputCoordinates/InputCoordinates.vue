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
        >
            <div class="leaflet-bottom leaflet-left mb-4">
                <div
                    ref="cadastreToggler"
                    class="bg-white ml-3 my-3 border-2 border-primary text-primary hover:bg-primary hover:text-white py-1 px-2 leaflet-control print:hidden"
                    :class="{
                        'opacity-50': cadastreIsLoading,
                    }"
                    v-show="cadastre"
                >
                    <label
                        class="flex gap-2 items-center space-x-2 cursor-pointer"
                        @click.prevent.stop="showCadastre = !showCadastre"
                    >
                        <input
                            type="checkbox"
                            v-model="showCadastre"
                            :disabled="cadastreIsLoading"
                            class="hidden"
                        />
                        <Icon
                            :icon="showCadastre ? 'eye' : 'eye-slash'"
                            class="p-0 !ml-0"
                        />
                        <span class="p-0 !ml-0"
                            >{{ showCadastre ? "Masquer" : "Voir" }} le
                            cadastre</span
                        >
                    </label>
                </div>
            </div>
        </Carto>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed, watch, ref, onMounted } from "vue";
import { useField, useIsSubmitting } from "vee-validate";
import Carto from "@/components/Carto/Carto.vue";
import L from "leaflet";
import marqueurInput from "@/utils/marqueurInput";
import InputCoordinatesTooltip from "./InputCoordinatesTooltip.vue";
import { useNotificationStore } from "@/stores/notification.store";
import copyToClipboard from "@/utils/copyToClipboard";
import { getCadastre } from "@/api/ign.api";
import generateSquare from "@/utils/generateSquare";
import { Icon } from "@resorptionbidonvilles/ui";

const DEFAULT_ZOOM = 14;
const carto = ref(null);
const cadastreToggler = ref(null);
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});
const { name } = toRefs(props);
const showCadastre = ref(false);
const cadastre = ref(null);
const cadastreIsLoading = ref(null);
const notificationStore = useNotificationStore();
const isSubmitting = useIsSubmitting();
const markersGroup = ref(
    L.geoJSON([], {
        onEachFeature: handleParcelle,
    })
);
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

function createCadastreControl() {
    const CadastreToggler = L.Control.extend({
        options: {
            position: "bottomleft",
        },

        onAdd() {
            return cadastreToggler.value;
        },
    });

    return new CadastreToggler();
}

function handleParcelle(feature, layer) {
    const { numero, feuille, section, code_insee } = feature.properties;
    layer.bindTooltip(
        `N°${numero}<br/>Feuille ${feuille}<br/>Section ${section}<br/>N°INSEE ${code_insee}`
    );

    layer.on("click", () => {
        copyToClipboard(
            `N°${numero}\nFeuille ${feuille}\nSection ${section}\nN°INSEE ${code_insee}`
        );
        notificationStore.success(
            "Copie de la parcelle cadastrale",
            "Les données de cette parcelle cadastrale ont bien été copiées dans votre presse-papier"
        );
    });
}

async function loadCadastre() {
    if (cadastreIsLoading.value === true) {
        return;
    }

    cadastreIsLoading.value = true;
    try {
        const response = await getCadastre(
            generateSquare([view.value[1], view.value[0]], 0.06)
        );

        if (
            Number.isInteger(response.totalFeatures) &&
            response.totalFeatures > 0
        ) {
            cadastre.value = response;
        }
    } catch (error) {
        // ignore
    }

    cadastreIsLoading.value = false;
}

function refreshInput(center, emitInput = true) {
    if (isSubmitting.value === true) {
        return;
    }

    inputMarker.setLatLng(center);
    carto.value && carto.value.setView({ center });

    if (emitInput === true) {
        handleChange(center);
    }
}

function handleClick({ latlng: { lat, lng } }) {
    refreshInput([lat, lng]);
    clearTimeout(clickTimeout);
    clickTimeout = null;
}

watch(view, () => {
    loadCadastre();
});

watch(carto, () => {
    if (carto.value) {
        const { map } = carto.value;
        inputMarker.addTo(map);
        carto.value.addControl("cadastreToggler", createCadastreControl());
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

watch(showCadastre, () => {
    const { map } = carto.value;

    if (showCadastre.value === false) {
        if (map.hasLayer(markersGroup.value)) {
            map.removeLayer(markersGroup.value);
        }
    } else if (!map.hasLayer(markersGroup.value)) {
        map.addLayer(markersGroup.value);
        map.setView(view.value, 15);
    }
});

watch(cadastre, () => {
    markersGroup.value.clearLayers();
    markersGroup.value.addData(cadastre.value);
});

onMounted(() => {
    loadCadastre();
});
</script>
