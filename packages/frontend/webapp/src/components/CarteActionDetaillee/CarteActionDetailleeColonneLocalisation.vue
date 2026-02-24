<template>
    <div
        class="items-center"
        tabindex="0"
        aria-label="Localisations de l'action"
    >
        <Icon icon="map-marker-alt" class="text-lg" style="color: #000091" />
        <span class="text-dark font-bold"> Lieu </span>
        <div>
            <span v-if="action.location_type === 'sur_site'">
                <span
                    v-if="numberOfSites?.length > 0"
                    tabindex="0"
                    :aria-label="`Localisation: sur ${numberOfSites} `"
                    >{{ numberOfSites }}<br
                /></span>
            </span>
            <span
                v-if="action.location_type === 'eti'"
                tabindex="0"
                :aria-label="`Localisation: ${action.eti.address}`"
                >{{ action.eti.address }}</span
            >
            <span
                v-if="action.location_type === 'logement'"
                tabindex="0"
                aria-label="Localisation: dans le logement"
                >Dans le logement</span
            >
            <span
                v-if="action.location_type === 'autre'"
                tabindex="0"
                :aria-label="`Localisation: ${action.location_other}`"
                >{{ action.location_other }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    action: {
        type: Object,
    },
});
const { action } = toRefs(props);

const numberOfSites = computed(() => {
    return `${action.value.location_shantytowns?.length} site${
        action.value.location_shantytowns?.length > 1 ? "s" : ""
    }`;
});
</script>
