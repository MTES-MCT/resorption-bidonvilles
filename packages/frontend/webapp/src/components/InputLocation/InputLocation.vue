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
import { searchActionOperators } from "@/api/organizations.api.js";
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
    const trimmedSearch = value.trim();
    const actionIdPattern = /^ID\d{8,}$/i;

    // 1. Recherche d'action par ID
    let actionPromise = Promise.resolve([]);
    if (actionIdPattern.test(trimmedSearch)) {
        const last4Chars = trimmedSearch.slice(-4);
        const actionId = Number.parseInt(last4Chars, 10);

        if (!Number.isNaN(actionId) && actionId > 0) {
            actionPromise = fetchOne(actionId)
                .then((action) => [
                    {
                        id: `action-${action.id}`,
                        label: `${action.name} - ${action.displayId}`,
                        category: "Action",
                        data: {
                            type: "action",
                            actionId: action.id,
                            actionName: action.name,
                            displayId: action.displayId,
                        },
                    },
                ])
                .catch(() => []);
        }
    }

    // 2. Recherche géographique
    const locationPromise = autocomplete(value)
        .then((items) =>
            items.map((loc) => ({
                id: loc.code,
                label: formatLocationLabel(loc),
                category: loc.label,
                data: {
                    code: loc.code,
                    departement: loc.departement,
                    typeName: loc.label,
                    typeUid: loc.type,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                },
            }))
        )
        .catch((error) => {
            console.error("Error fetching locations:", error);
            return [];
        });

    // 3. Recherche de structures
    const organizationPromise = searchActionOperators(value)
        .then((organizations) =>
            organizations.map((org) => ({
                id: `organization-${org.id}`,
                label: org.abbreviation
                    ? `${org.name} (${org.abbreviation})`
                    : org.name,
                category: "Structure",
                data: {
                    type: "organization",
                    organizationId: org.id,
                    organizationName: org.name,
                    organizationAbbreviation: org.abbreviation,
                },
            }))
        )
        .catch((error) => {
            console.error("Error fetching organizations:", error);
            return [];
        });

    const [actions, locations, organizations] = await Promise.all([
        actionPromise,
        locationPromise,
        organizationPromise,
    ]);
    return [...actions, ...locations, ...organizations];
}

defineExpose({
    focus: () => {
        input.value.focus();
    },
});
</script>
