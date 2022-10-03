<template>
    <DetailsPanel>
        <template v-slot:title>Conditions de vie et environnement</template>
        <template v-slot:body>
            <Tag
                variant="pin_red"
                :uppercase="false"
                v-if="town.livingConditions.version < 2"
                ><span class="text-sm"
                    >Nouveau : le formulaire des conditions de vie évolue pour
                    être plus précis et plus exhaustif sur l'accès à l'eau,
                    l'électricité et aux toilettes.
                    <span
                        class="underline font-bold cursor-pointer hover:no-underline"
                        @click="routeToUpdate"
                        >Mettez le à jour</span
                    >
                    pour partager un état des lieux plus juste et identifier les
                    besoins.</span
                ></Tag
            >

            <TownDetailsPanelLivingConditionsSection
                title="Accès à l’eau"
                info="Un accès à l'eau est caractérisé par la mise à disposition d'une eau potable avec un nombre adapté de robinets (minimum recommandé 1 robinet pour 50 personnes, qui doit être adapté aux spécificités du site), à une distance limitant le portage de charges lourdes (à l'intérieur du site, à moins de 200 m de l'habitation la plus éloignée)."
                :status="town.livingConditions.water.status"
                cypressName="access_to_water"
                cypressDetailsPrefix="water"
                :answers="answers.water"
            />

            <TownDetailsPanelLivingConditionsSection
                title="Accès aux toilettes"
                :status="town.livingConditions.sanitary.status"
                cypressName="access_to_sanitary"
                cypressDetailsPrefix="sanitary"
                :answers="answers.sanitary"
            />

            <TownDetailsPanelLivingConditionsSection
                title="Accès à l’électricité"
                sanitary
                :status="town.livingConditions.electricity.status"
                cypressName="electricity_type"
                cypressDetailsPrefix="electricity"
                :answers="answers.electricity"
            />

            <TownDetailsPanelLivingConditionsSection
                title="Évacuation des déchets"
                :status="town.livingConditions.trash.status"
                cypressName="trash_evacuation"
                cypressDetailsPrefix="trash"
            />

            <div v-if="town.livingConditions.version === 1">
                <TownDetailsPanelLivingConditionsSection
                    :title="pestAnimalsWording"
                    :status="town.livingConditions.vermin.status"
                    :showStatus="false"
                    cypressName="vermin"
                    cypressDetailsPrefix="vermin"
                    :answers="answers.pest_animals"
                    :inverted="true"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.firePrevention.status"
                    cypressName="fire_prevention_measures"
                    cypressDetailsPrefix="fire_prevention"
                    :answers="answers.fire_prevention"
                />
            </div>

            <div v-if="town.livingConditions.version === 2">
                <TownDetailsPanelLivingConditionsSection
                    :title="pestAnimalsWording"
                    :status="town.livingConditions.pest_animals.status"
                    :showStatus="false"
                    :inverted="true"
                    :answers="answers.pest_animals"
                />

                <TownDetailsPanelLivingConditionsSection
                    title="Prévention des incendies"
                    :status="town.livingConditions.fire_prevention.status"
                />
            </div>
        </template>
    </DetailsPanel>
</template>

<script>
import DetailsPanel from "#app/components/ui/details/DetailsPanel.vue";
import TownDetailsPanelLivingConditionsSection from "./ui/TownDetailsPanelLivingConditionsSection";
import { serializeLivingConditions } from "#frontend/common/helpers/town/living_conditions/serializeLivingConditions";

export default {
    props: {
        town: {
            type: Object
        }
    },
    components: { TownDetailsPanelLivingConditionsSection, DetailsPanel },
    methods: {
        routeToUpdate() {
            this.$router.push(`/site/${this.town.id}/mise-a-jour`);
        }
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
        }
    }
};
</script>
