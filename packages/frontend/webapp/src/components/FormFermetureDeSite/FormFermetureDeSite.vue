<template>
    <DsfrAlert class="my-8" small title="Titre alerte" type="warning" v-if="mode === 'fix'>
        Ce site ayant déjà été déclaré comme fermé, ce formulaire ne vous permet
        que de corriger la déclaration de résorption. Pour toute autre
        modification,
        <span class="inline-link-wrapper">
            <Link :to="`mailto:${CONTACT_EMAIL}`">
                veuillez prendre contact directement avec nous</Link
            >.
        </span>
    </DsfrAlert>

    <FormSection>
        <template v-slot:title>Déclaration de fermeture</template>

        <FormFermetureDeSiteInputClosedAt :disabled="mode === 'fix'" />
        <FormFermetureDeSiteInputStatus :disabled="mode === 'fix'" />
        <FormFermetureDeSiteInputClosingContext :disabled="mode === 'fix'" />
        <FormFermetureDeSiteInputSolutions
            :disabled="mode === 'fix'"
            @update:solutions="handleSolutions"
        />
        <FormFermetureDeSiteInputClosedWithSolutions
            :peopleWithSolutions="peopleWithSolutions"
        />
    </FormSection>

    <ErrorSummary
        id="erreurs"
        class="mt-12"
        v-if="error || Object.keys(errors).length > 0"
        :message="error"
        :summary="errors"
    />
</template>

<script setup>
import ENV from "@/helpers/env.js";
import { defineProps, defineExpose, ref, toRefs, computed } from "vue";
import { useForm, useFormErrors } from "vee-validate";
import { useNotificationStore } from "@/stores/notification.store";
import { useTownsStore } from "@/stores/towns.store";
import formatDate from "@common/utils/formatDate";
import backOrReplace from "@/utils/backOrReplace";
import { close, setClosedWithSolutions } from "@/api/towns.api";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import schemaFn from "./FormFermetureDeSite.schema";

import { ErrorSummary, Link } from "@resorptionbidonvilles/ui";
import FormSection from "@/components/FormSection/FormSection.vue";
import FormFermetureDeSiteInputClosedAt from "./inputs/FormFermetureDeSiteInputClosedAt.vue";
import FormFermetureDeSiteInputStatus from "./inputs/FormFermetureDeSiteInputStatus.vue";
import FormFermetureDeSiteInputClosingContext from "./inputs/FormFermetureDeSiteInputClosingContext.vue";
import FormFermetureDeSiteInputSolutions from "./inputs/FormFermetureDeSiteInputSolutions.vue";
import FormFermetureDeSiteInputClosedWithSolutions from "./inputs/FormFermetureDeSiteInputClosedWithSolutions.vue";

const { CONTACT_EMAIL } = ENV;
const props = defineProps({
    town: Object,
});
const { town } = toRefs(props);
const errors = useFormErrors();
const error = ref(null);
const peopleWithSolutions = ref(0);
const totalPeopleAffected = ref(0);

const mode = computed(() => {
    return town.value.closedAt !== null ? "fix" : "declare";
});
const schema = computed(() => {
    return schemaFn(mode.value);
});

const { handleSubmit, setErrors, isSubmitting } = useForm({
    validationSchema: schema,
    initialValues: {
        closed_at: town.value.closedAt
            ? formatDate(town.value.closedAt, "y-m-d")
            : null,
        status: town.value.status,
        closing_context: town.value.closingContext,
        solutions: town.value.closingSolutions.map(({ id }) => id),
        solution_details: town.value.closingSolutions.reduce(
            (acc, { id, householdsAffected, peopleAffected, message }) => {
                acc[id] = {
                    householdsAffected,
                    peopleAffected,
                    message,
                };
                return acc;
            },
            {}
        ),
        closed_with_solutions: town.value.closedWithSolutions
            ? town.value.closedWithSolutions === "yes"
            : undefined,
    },
});

const handleSolutions = (newValue) => {
    const validOrientation = [8, 9];
    let tmpPeopleAffectedArray = [];
    totalPeopleAffected.value = 0;
    for (const [key, value] of Object.entries(newValue)) {
        totalPeopleAffected.value = value.peopleAffected
            ? totalPeopleAffected.value + parseInt(value.peopleAffected)
            : totalPeopleAffected.value;
        if (
            parseInt(totalPeopleAffected.value) >
            parseInt(town.value.populationTotal)
        ) {
            error.value =
                "Le nombre de personnes réorientées ne peut pas être supérieur à la population totale du site. Si besoin, avant de procéder à la fermeture du site, veuillez mettre à jour la population totale dans la rubrique habitants.";
            return;
        } else {
            error.value = null;
        }
        if (validOrientation.includes(parseInt(key))) {
            tmpPeopleAffectedArray.push(value);
        }
    }

    const actualPeopleAffected = Object.values(tmpPeopleAffectedArray).reduce(
        (acc, solution) => {
            if (solution.peopleAffected) {
                return parseInt(acc) + parseInt(solution.peopleAffected);
            } else {
                return parseInt(acc);
            }
        },
        0
    );

    peopleWithSolutions.value = (
        (actualPeopleAffected / town.value.populationTotal) *
        100
    ).toFixed(0);
};

const config = {
    declare: {
        async submit(values) {
            const updatedTown = await close(town.value.id, {
                closed_at: formatDate(values.closed_at / 1000, "y-m-d"),
                status: values.status,
                closing_context: values.closing_context,
                solutions: values.solutions.map((id) => {
                    return {
                        id,
                        ...values.solution_details[id],
                    };
                }),
                closed_with_solutions: values.closed_with_solutions,
            });

            trackEvent("Site", "Fermeture site", `S${town.value.id}`);

            if (values.closed_with_solutions) {
                trackEvent("Site", "Résorption du site", `S${town.value.id}`);
            }

            return updatedTown;
        },
        successTitle: "Fermeture du site",
        successWording:
            "Le site a bien été déclaré comme fermé. Les acteurs concernés ont été prévenus par mail",
    },
    fix: {
        submit(values) {
            return setClosedWithSolutions(town.value.id, {
                closed_with_solutions: values.closed_with_solutions,
            });
        },
        successTitle: "Correction de la fermeture",
        successWording:
            "Les données relatives à la fermeture du site ont bien été modifiées",
    },
};

defineExpose({
    submit: handleSubmit(async (values) => {
        if (mode.value === "fix") {
            const originalValue = town.value.closedWithSolutions === "yes";
            if (originalValue === values.closed_with_solutions) {
                router.replace("#erreurs");
                error.value =
                    "Modification impossible : aucun champ n'a été modifié";
                return;
            }
        }
        if (totalPeopleAffected.value > town.value.populationTotal) {
            error.value =
                "Le nombre de personnes réorientées ne peut pas être supérieur à la population totale du site. Si besoin, avant de procéder à la fermeture du site, veuillez mettre à jour la population totale dans la rubrique habitants.";
            return;
        }

        const { submit, successTitle, successWording } = config[mode.value];
        const townsStore = useTownsStore();
        const notificationStore = useNotificationStore();
        error.value = null;

        try {
            const updatedTown = await submit(values);
            townsStore.setTown(town.value.id, updatedTown);
            notificationStore.success(successTitle, successWording);

            backOrReplace(`/site/${town.value.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
    isSubmitting,
});
</script>
<style scoped>
.inline-link-wrapper {
    display: inline-block;
}

.inline-link-wrapper :deep(p) {
    display: inline;
    margin: 0;
    padding: 0;
}
</style>
