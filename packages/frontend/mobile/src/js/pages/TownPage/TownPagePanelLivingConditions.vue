<template>
    <div>
        <div class="items-center flex justify-between">
            <TownPagePanelTitle :title="'Conditions de vie'" />
            <Button
                v-if="canUpdateTown"
                class="mt-4 mb-2"
                variant="primaryText"
                icon="pencil"
                iconPosition="left"
                :href="`/site/${town.id}/mise-a-jour/living_conditions`"
                >Modifier</Button
            >
        </div>

        <div>
            <TownPagePanelLivingConditionsSection
                title="Accès à l’eau"
                :status="town.livingConditions.water.status"
                :answers="answers.water"
            />
            <TownPagePanelLivingConditionsSection
                title="Accès aux toilettes"
                :status="town.livingConditions.sanitary.status"
                :answers="answers.sanitary"
            />

            <TownPagePanelLivingConditionsSection
                title="Accès à l’électricité"
                sanitary
                :status="town.livingConditions.electricity.status"
                :answers="answers.electricity"
            />

            <TownPagePanelLivingConditionsSection
                title="Évacuation des déchets"
                :status="town.livingConditions.trash.status"
            />

            <div v-if="town.livingConditions.version === 1">
                <TownPagePanelLivingConditionsSection
                    :title="pestAnimalsWording"
                    :status="town.livingConditions.vermin.status"
                    :showStatus="false"
                    :answers="answers.pest_animals"
                    :inverted="true"
                />

                <TownPagePanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.firePrevention.status"
                    :answers="answers.fire_prevention"
                />
            </div>

            <div v-if="town.livingConditions.version === 2">
                <TownPagePanelLivingConditionsSection
                    :title="pestAnimalsWording"
                    :status="town.livingConditions.pest_animals.status"
                    :showStatus="false"
                    :inverted="true"
                    :answers="answers.pest_animals"
                />

                <TownPagePanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.fire_prevention.status"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRefs, computed } from "vue";
import store from "#src/store/index.js";
import serializeLivingConditions from "#frontend/common/helpers/town/living_conditions/serializeLivingConditions";
import TownPagePanelLivingConditionsSection from "./LivingConditions/TownPagePanelLivingConditionsSection.vue";
import TownPagePanelTitle from "./TownPagePanelTitle.vue";
import { Button } from "@resorptionbidonvilles/ui";
const props = defineProps({
    town: {
        type: Object,
        required: true,
    },
});
const { town } = toRefs(props);
const answers = computed(() => {
    return serializeLivingConditions(town.value);
});

const canUpdateTown = computed(() => {
    return (
        store.getters["config/hasLocalizedPermission"](
            "shantytown.update",
            town.value
        ) === true && town.value.status === "open"
    );
});

const pestAnimalsWording = computed(() => {
    return town.value.livingConditions[
        town.value.livingConditions.version === 1 ? "vermin" : "pest_animals"
    ].status.status === "good"
        ? "Absence de nuisible"
        : "Présence de nuisibles";
});
</script>
