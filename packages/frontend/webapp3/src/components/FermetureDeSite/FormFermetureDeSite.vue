<template>
    <div class="mb-10 border border-orange400 px-5 py-3" v-if="mode === 'fix'">
        <Warning :autohide="false"
            >Ce site ayant déjà été déclaré comme fermé, ce formulaire ne vous
            permet que de corriger la déclaration de résorption. Pour toute
            autre modification,
            <Link :to="`mailto:${CONTACT_EMAIL}`"
                >veuillez prendre contact directement avec nous</Link
            >.</Warning
        >
    </div>

    <FormSection>
        <template v-slot:title>Déclaration de fermeture</template>

        <FormFermetureDeSiteInputClosedAt
            :disabled="mode === 'fix'"
            :defaultValue="
                town.closedAt ? formatDate(town.closedAt, 'y-m-d') : null
            "
        />
        <FormFermetureDeSiteInputStatus
            :disabled="mode === 'fix'"
            :defaultValue="town.status"
        />
        <FormFermetureDeSiteInputClosingContext
            :disabled="mode === 'fix'"
            :defaultValue="town.closingContext"
        />
        <FormFermetureDeSiteInputSolutions
            :disabled="mode === 'fix'"
            :defaultValue="town.closingSolutions"
        />
        <FormFermetureDeSiteInputClosedWithSolutions
            :peopleWithSolutions="peopleWithSolutions"
            :defaultValue="
                town.closedWithSolutions
                    ? town.closedWithSolutions === 'yes'
                    : undefined
            "
        />
    </FormSection>

    <ErrorSummary
        class="mt-12"
        v-if="error || Object.keys(errors).length > 0"
        :message="error"
        :summary="errors"
    />
</template>

<script setup>
import ENV from "@/helpers/env.js";
import { defineProps, toRefs, computed } from "vue";
import { useConfigStore } from "@/stores/config.store";
import { useFormValues, useFormErrors } from "vee-validate";

import { ErrorSummary, Link, Warning } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormFermetureDeSiteInputClosedAt from "./inputs/FormFermetureDeSiteInputClosedAt.vue";
import FormFermetureDeSiteInputStatus from "./inputs/FormFermetureDeSiteInputStatus.vue";
import FormFermetureDeSiteInputClosingContext from "./inputs/FormFermetureDeSiteInputClosingContext.vue";
import FormFermetureDeSiteInputSolutions from "./inputs/FormFermetureDeSiteInputSolutions.vue";
import FormFermetureDeSiteInputClosedWithSolutions from "./inputs/FormFermetureDeSiteInputClosedWithSolutions.vue";
import formatDate from "@/utils/formatDate";

const { CONTACT_EMAIL } = ENV;
const props = defineProps({
    town: Object,
    mode: String,
    error: {
        type: String,
        required: false,
        default: null,
    },
});
const { town, mode, error } = toRefs(props);
const values = useFormValues();
const errors = useFormErrors();

const actualSolutionIds = computed(() => {
    const actualSolutions = [
        "Hébergement ou logement adapté longue durée avec accompagnement, dont espace temporaire d’insertion",
        "Logement",
    ];

    const configStore = useConfigStore();
    return actualSolutions.map((label) => {
        const s = configStore.config.closing_solutions.find(
            ({ label: l }) => l === label
        );
        return s?.id || null;
    });
});

const peopleWithSolutions = computed(() => {
    if (!town.value.populationTotal) {
        return null;
    }

    let total = actualSolutionIds.value.reduce((acc, solutionId) => {
        return (
            acc +
            (values.solution_details?.[`${solutionId}`]?.peopleAffected || 0)
        );
    }, 0);
    return ((total / town.value.populationTotal) * 100).toFixed(0);
});
</script>
