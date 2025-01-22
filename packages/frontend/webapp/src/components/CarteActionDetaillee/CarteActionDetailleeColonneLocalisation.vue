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
                    v-for="shantytown in action.location_shantytowns"
                    :key="shantytown.id"
                    tabindex="0"
                    :aria-label="`Localisation: sur site ${shantytown.usename}`"
                    >- {{ shantytown.usename }}<br
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
import { defineProps, toRefs } from "vue";
import { Icon } from "@resorptionbidonvilles/ui";

const props = defineProps({
    action: {
        type: Object,
    },
});
const { action } = toRefs(props);
</script>
