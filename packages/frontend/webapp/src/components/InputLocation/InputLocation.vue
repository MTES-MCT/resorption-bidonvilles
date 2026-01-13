<template>
    <Autocomplete
        v-bind="$attrs"
        :fn="autocompleteFn"
        v-model="location"
        showCategory
        ref="input"
        class="bg-white"
    />
</template>

<script setup>
import { defineProps, toRefs, computed, defineEmits, ref } from "vue";
import { Autocomplete } from "@resorptionbidonvilles/ui";
import { autocomplete } from "@/api/locations.api.js";
import { fetchOne } from "@/api/actions.api.js";
import formatLocationLabel from "@/utils/formatLocationLabel.js";
import { trackEvent } from "@/helpers/matomo";

const props = defineProps({
    modelValue: {
        type: Object,
        required: false,
        default: () => undefined,
    },
});
const { modelValue } = toRefs(props);
const emit = defineEmits(["update:modelValue"]);
const input = ref(null);
const location = computed({
    get() {
        return modelValue.value;
    },
    set(value) {
        if (value) {
            trackEvent(
                "Recherche autocomplete",
                "Utilisation du module de recherche",
                `${window.location.href.split("/").pop()}: ${value.search}`
            );
        }
        emit("update:modelValue", value);
    },
});

async function autocompleteFn(value) {
    const allResults = [];

    const actionIdPattern = /^ID\d{8,}$/i;

    if (actionIdPattern.test(value.trim())) {
        const last4Chars = value.trim().slice(-4);
        const actionId = parseInt(last4Chars, 10);

        if (!isNaN(actionId) && actionId > 0) {
            try {
                const action = await fetchOne(actionId);
                allResults.push({
                    id: `action-${action.id}`,
                    label: `${action.name} - ${action.displayId}`,
                    category: "Action",
                    data: {
                        type: "action",
                        actionId: action.id,
                        actionName: action.name,
                        displayId: action.displayId,
                    },
                });
            } catch (_error) {
                // Action non trouvée, on ignore silencieusement
                // Le préfixe _ est une convention universelle
                // qui indique qu'on ignore intentionnellement le paramètre.
            }
        }
    }

    try {
        const results = await autocomplete(value);
        const locationResults = results.map((location) => ({
            id: location.code,
            label: formatLocationLabel(location),
            category: location.label,
            data: {
                code: location.code,
                departement: location.departement,
                typeName: location.label,
                typeUid: location.type,
                latitude: location.latitude,
                longitude: location.longitude,
            },
        }));
        allResults.push(...locationResults);
    } catch (error) {
        console.error("Error fetching locations:", error);
    }

    return allResults;
}

defineExpose({
    focus: () => {
        input.value.focus();
    },
});
</script>
