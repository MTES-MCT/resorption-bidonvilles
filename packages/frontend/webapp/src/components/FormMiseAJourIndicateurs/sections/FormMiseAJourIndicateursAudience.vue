<template>
    <FormSection id="audience">
        <template v-slot:title>Public</template>

        <FormParagraph :title="title">
            <div class="mb-3 text-G600">
                <p v-if="dateOfLastState === null">
                    Vous renseignez les indicateurs de suivi pour la première
                    fois. Veuillez porter une attention particulière aux données
                    que vous renseignez ci-dessous : les mises à jour
                    ultérieures seront conditionnées par cette première
                    déclaration.
                </p>
                <div v-else>
                    <p v-if="plan.in_and_out === true">
                        Les entrées et sorties de l'action sont suivies, car le
                        pilote de l’action au sein des services de l’Etat a
                        renseigné qu’il existe un système d’entrées et de
                        sorties.
                    </p>
                    <p v-else>
                        Seules les sorties de l'action sont suivies, car le
                        pilote de l’action au sein des services de l’Etat a
                        renseigné qu’il n’existe pas de système d’entrées et de
                        sorties de l'action : l'action concerne un seul groupe
                        de personne, ayant débuté le projet à la même période.
                    </p>
                    <p class="font-bold">
                        Attention : le remplissage de ce tableau a un impact sur
                        le nombre de personnes identifiées dans cette action.
                        Merci de le renseigner avec attention.
                    </p>
                    <p class="mt-4">
                        Au {{ dateOfLastState }}, date de la dernière mise à
                        jour des informations, sont intégrés dans l'action :
                        {{ plan.audience.families }} ménages,
                        {{ plan.audience.total }} personnes dont
                        {{ plan.audience.women }} femmes et
                        {{ plan.audience.minors }} mineurs
                    </p>
                </div>
            </div>

            <FormMiseAJourIndicateursInputAudience :mode="mode" />
        </FormParagraph>
    </FormSection>
</template>

<script setup>
import { defineProps, toRefs, computed } from "vue";
import formatDate from "@/utils/formatDate";

import FormSection from "@/components/FormSection/FormSection.vue";
import FormParagraph from "@/components/FormParagraph/FormParagraph.vue";
import FormMiseAJourIndicateursInputAudience from "../inputs/FormMiseAJourIndicateursInputAudience.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const mode = computed(() => {
    if (plan.value.states.length === 0) {
        return "in_only";
    }
    if (plan.value.in_and_out !== true) {
        return "out_only";
    }
    return "in_and_out";
});

const dateOfLastState = computed(() => {
    if (plan.value.states.length === 0) {
        return null;
    }
    const [lastState] = plan.value.states.slice(-1);
    return formatDate(lastState.date / 1000, "d/m/y");
});

const title = computed(() => {
    if (dateOfLastState.value === null) {
        return "Qui sont les publics ayant intégré l'action ?";
    }
    return `Quelles ont été les entrées et sorties de l'action depuis la date du ${dateOfLastState.value} ?`;
});
</script>
