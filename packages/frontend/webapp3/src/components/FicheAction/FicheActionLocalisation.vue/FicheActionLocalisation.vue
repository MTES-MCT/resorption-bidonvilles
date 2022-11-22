<template>
    <FicheRubrique title="Lieu">
        <FicheSousRubrique class="mt-4">
            <section class="flex-grow">
                <Icon icon="map-pin" class="mr-2" />
                <span class="font-bold">{{ plan.location_type.label }}</span>
                <div v-if="plan.location_type.id === 'location'">
                    <p>{{ plan.location.label }}</p>
                </div>
                <div
                    v-if="plan.location_type.id === 'shantytowns'"
                    class="grid grid-cols-2 gap-y-2"
                >
                    <div v-for="shantytown in shantytowns" :key="shantytown.id">
                        <div class="flex items-center customAlign">
                            <Icon
                                icon="map-marker-alt"
                                class="text-lg"
                                :style="`color: ${shantytown.fieldType.color}`"
                            />
                            <div class="font-bold ml-2 whitespace-nowrap">
                                {{ shantytown.fieldType.label }}
                            </div>
                        </div>

                        <router-link
                            :to="`/site/${shantytown.id}`"
                            class="link pl-5"
                            >{{ shantytown.usename }}</router-link
                        >
                    </div>
                </div>
                <p v-if="plan.location_type.id === 'other'">
                    {{ plan.location_details }}
                </p>
            </section>
        </FicheSousRubrique>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import enrichShantytown from "@/utils/enrichShantytown";
import { useConfigStore } from "@/stores/config.store";

import { Icon } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSousRubrique from "@/components/FicheRubrique/FicheSousRubrique.vue";

const configStore = useConfigStore();

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

// TODO à réintégrer avec la minicarte
// const address = computed(() => {
//     return {
//         latitude: plan.value.location.latitude,
//         longitude: plan.value.location.longitude,
//         address: plan.value.location.label,
//     };
// });

// const center = computed(() => {
//     return {
//         center: [plan.value.location.latitude, plan.value.location.longitude],
//         zoom: 15,
//     };
// });

const shantytowns = computed(() => {
    if (!Array.isArray(plan.value.shantytowns)) {
        return null;
    }

    return plan.value.shantytowns.map((shantytown) =>
        enrichShantytown(shantytown, configStore.config.field_types)
    );
});
</script>
