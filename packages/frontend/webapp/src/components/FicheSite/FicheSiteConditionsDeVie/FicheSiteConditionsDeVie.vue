<template>
    <FicheRubrique
        title="Conditions de vie et environnement"
        category="living_conditions"
    >
        <p
            class="mt-4 mb-2 border border-red bg-red200 px-4 py-3"
            v-if="town.livingConditions.version < 2 && !town.closedAt"
        >
            <span class="font-bold text-red500"
                ><Icon icon="exclamation-triangle" /> Nouveau</span
            ><br />
            <span class="text-sm">
                Le formulaire des conditions de vie évolue pour être plus précis
                et plus exhaustif sur l'accès à l'eau, l'électricité et aux
                toilettes.<br />
                <Link :to="`/site/${town.id}/mise-a-jour`"
                    >Mettez le à jour</Link
                >
                pour partager un état des lieux plus juste et identifier les
                besoins.
            </span>
        </p>

        <FicheSiteConditionsDeVieRubrique
            :border="true"
            :marginTop="false"
            title="Alerte canicule"
            info="L'alerte canicule peut être déclenchée lorsque la température dépasse un seuil critique, mettant en danger la santé des populations vulnérables."
            :status="heatwaveStatus"
            :answers="[]"
        />

        <FicheSiteConditionsDeVieRubrique
            :border="false"
            :marginTop="false"
            title="Accès à l’eau"
            info="Un accès à l'eau est caractérisé par la mise à disposition d'une eau potable avec un nombre adapté de robinets (minimum recommandé 1 robinet pour 50 personnes, qui doit être adapté aux spécificités du site), à une distance limitant le portage de charges lourdes (à l'intérieur du site, à moins de 200 m de l'habitation la plus éloignée)."
            :status="town.livingConditions.water.status"
            :answers="answers.water"
        />

        <FicheSiteConditionsDeVieRubrique
            title="Accès aux toilettes"
            :status="town.livingConditions.sanitary.status"
            :answers="answers.sanitary"
        />

        <FicheSiteConditionsDeVieRubrique
            title="Accès à l’électricité"
            :status="town.livingConditions.electricity.status"
            :answers="answers.electricity"
        />

        <FicheSiteConditionsDeVieRubrique
            title="Évacuation des déchets"
            :status="town.livingConditions.trash.status"
        />

        <div v-if="town.livingConditions.version === 1">
            <FicheSiteConditionsDeVieRubrique
                :title="pestAnimalsWording"
                :status="town.livingConditions.vermin.status"
                :showStatus="false"
                :answers="answers.pest_animals"
                :inverted="true"
            />

            <FicheSiteConditionsDeVieRubrique
                title="Prévention des incendies"
                :status="town.livingConditions.firePrevention.status"
                :answers="answers.fire_prevention"
            />
        </div>

        <div v-if="town.livingConditions.version === 2">
            <FicheSiteConditionsDeVieRubrique
                v-if="
                    ['good', 'bad'].includes(
                        town.livingConditions.pest_animals.status.status
                    )
                "
                :title="pestAnimalsWording"
                :status="town.livingConditions.pest_animals.status"
                :showStatus="false"
                :answers="answers.pest_animals"
            />
            <FicheSiteConditionsDeVieRubrique
                v-else
                :title="pestAnimalsWording"
                :status="town.livingConditions.pest_animals.status"
                :answers="answers.pest_animals"
            />

            <FicheSiteConditionsDeVieRubrique
                title="Prévention des incendies"
                :status="town.livingConditions.fire_prevention.status"
            />
        </div>
    </FicheRubrique>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import serializeLivingConditions from "@common/helpers/town/living_conditions/serializeLivingConditions";

import { Icon, Link } from "@resorptionbidonvilles/ui";
import FicheRubrique from "@/components/FicheRubrique/FicheRubrique.vue";
import FicheSiteConditionsDeVieRubrique from "./FicheSiteConditionsDeVieRubrique.vue";

const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);

const answers = computed(() => {
    return serializeLivingConditions(town.value);
});

const pestAnimalsWording = computed(() => {
    const key =
        town.value.livingConditions.version === 1 ? "vermin" : "pest_animals";

    return town.value.livingConditions[key].status.status === "good"
        ? "Absence de nuisible"
        : "Présence de nuisibles";
});

const heatwaveStatus = computed(() => {
    return {
        negative: [],
        positive: [],
        unknown: [],
        status:
            town.value.heatwaveStatus === true
                ? "activeHeatwave"
                : "inactiveHeatwave",
    };
});
</script>
