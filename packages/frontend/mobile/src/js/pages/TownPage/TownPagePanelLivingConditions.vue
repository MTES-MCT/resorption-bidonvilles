<template>
    <div>
        <Container>
            <TownPagePanelTitle :title="'Conditions de vie'" />
        </Container>

        <TownPagePanelLivingConditionsSection
            title="Accès à l’eau"
            :status="town.livingConditions.water.status"
            :answers="answers.water"
        />
        <TownPagePanelLivingConditionsSection
            class="mt-6"
            title="Accès aux toilettes"
            :status="town.livingConditions.sanitary.status"
            :answers="answers.sanitary"
        />

        <TownPagePanelLivingConditionsSection
            class="mt-6"
            title="Accès à l’électricité"
            sanitary
            :status="town.livingConditions.electricity.status"
            :answers="answers.electricity"
        />

        <TownPagePanelLivingConditionsSection
            class="mt-6"
            title="Évacuation des déchets"
            :status="town.livingConditions.trash.status"
        />

        <div v-if="town.livingConditions.version === 1">
            <TownPagePanelLivingConditionsSection
                class="mt-6"
                :title="pestAnimalsWording"
                :status="town.livingConditions.vermin.status"
                :showStatus="
                    town.livingConditions.vermin.status.status === 'unknown'
                "
                :answers="answers.pest_animals"
                :inverted="true"
            />

            <TownPagePanelLivingConditionsSection
                class="mt-6"
                title="Prévention des incendies"
                :status="town.livingConditions.firePrevention.status"
                :answers="answers.fire_prevention"
            />
        </div>

        <div v-if="town.livingConditions.version === 2">
            <TownPagePanelLivingConditionsSection
                class="mt-6"
                :title="pestAnimalsWording"
                :status="town.livingConditions.pest_animals.status"
                :showStatus="false"
                :inverted="true"
                :answers="answers.pest_animals"
            />

            <TownPagePanelLivingConditionsSection
                class="mt-6"
                title="Prévention des incendies"
                :status="town.livingConditions.fire_prevention.status"
            />
        </div>
    </div>
</template>

<script>
import Container from "#src/js/components/Container.vue";
import serializeLivingConditions from "#frontend/common/helpers/town/living_conditions/serializeLivingConditions";
import TownPagePanelLivingConditionsSection from "./LivingConditions/TownPagePanelLivingConditionsSection.vue";
import TownPagePanelTitle from "./TownPagePanelTitle.vue";

export default {
    props: {
        town: {
            type: Object,
            required: true,
        },
    },
    components: {
        Container,
        TownPagePanelLivingConditionsSection,
        TownPagePanelTitle,
    },
    computed: {
        answers() {
            return serializeLivingConditions(this.town);
        },
        pestAnimalsWording() {
            return this.town.livingConditions[
                this.town.livingConditions.version === 1
                    ? "vermin"
                    : "pest_animals"
            ].status.status === "good"
                ? "Absence de nuisible"
                : "Présence de nuisibles";
        },
    },
};
</script>
