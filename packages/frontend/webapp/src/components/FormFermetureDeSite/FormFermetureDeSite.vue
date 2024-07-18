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

import { ErrorSummary, Link, Warning } from "@resorptionbidonvilles/ui";
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

const mode = computed(() => {
    return town.value.closedAt !== null ? "fix" : "declare";
});
const schema = computed(() => {
    return schemaFn(mode.value);
});

const { setValues, handleSubmit, setErrors, isSubmitting } = useForm({
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
    const totalPeopleAffected = Object.values(newValue).reduce(
        (acc, solution) => {
            if (solution.peopleAffected) {
                // if (
                //     parseInt(acc) + parseInt(solution.peopleAffected) >
                //     town.value.populationTotal
                // ) {
                //     error.value =
                //         "Le nombre de personnes réorientées ne peut pas être supérieur à la population totale du site";
                //     return parseInt(acc);
                // }
                console.log("newValue", newValue);
                return parseInt(acc) + parseInt(solution.peopleAffected);
            } else {
                return parseInt(acc);
            }
        },
        0
    );

    setValues({ solution_details: newValue });
    peopleWithSolutions.value = (
        (totalPeopleAffected / town.value.populationTotal) *
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
        if (peopleWithSolutions.value > 100) {
            error.value =
                "Le nombre de personnes réorientées ne peut pas être supérieur à la population totale du site";
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
