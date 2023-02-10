<template>
    <div class="items-center">
        <Icon icon="map-marker-alt" class="text-lg" style="color: blue" />
        <span class="text-dark font-bold"> Lieu </span>
        <div>
            <span v-if="action.location_type === 'sur_site'">
                <span
                    v-for="shantytown in action.location_shantytowns"
                    :key="shantytown.id"
                    >- {{ shantytown.usename }}<br
                /></span>
            </span>
            <span v-if="action.location_type === 'eti'">{{
                action.eti.address
            }}</span>
            <span v-if="action.location_type === 'logement'"
                >Dans le logement</span
            >
            <span v-if="action.location_type === 'autre'"
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
