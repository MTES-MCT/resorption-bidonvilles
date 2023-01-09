<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>

        <FormMiseAJourIndicateursInfo />
        <FormMiseAjourIndicateursDate id="date" class="mt-6" :plan="plan" />
        <FormMiseAJourIndicateursAudience :plan="plan" v-if="values.date" />
        <FormMiseAJourIndicateursTeam
            class="mt-10"
            v-if="values.date"
            :plan="plan"
        />

        <FormMiseAJourIndicateursDroitsCommuns
            class="mt-10"
            v-if="values.date"
            :plan="plan"
        ></FormMiseAJourIndicateursDroitsCommuns>

        <FormMiseAJourIndicateursSante
            class="mt-10"
            v-if="values.date && topics.includes('health')"
            :plan="plan"
        ></FormMiseAJourIndicateursSante>

        <FormMiseAJourIndicateursEducation
            class="mt-10"
            v-if="values.date && topics.includes('school')"
            :plan="plan"
        ></FormMiseAJourIndicateursEducation>

        <FormMiseAJourIndicateursEmploi
            class="mt-10"
            v-if="values.date && topics.includes('work')"
            :plan="plan"
        ></FormMiseAJourIndicateursEmploi>

        <FormMiseAJourIndicateursLogement
            class="mt-10"
            v-if="values.date && topics.includes('housing')"
            :plan="plan"
        ></FormMiseAJourIndicateursLogement>

        <FormMiseAJourIndicateursSecurite
            class="mt-10"
            v-if="values.date && topics.includes('safety')"
            :plan="plan"
        ></FormMiseAJourIndicateursSecurite>
        <ErrorSummary
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </ArrangementLeftMenu>
</template>
<script setup>
import { defineProps, toRefs, computed, ref } from "vue";
import { useForm } from "vee-validate";
import { useNotificationStore } from "@/stores/notification.store";
import { usePlansStore } from "@/stores/plans.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import schemaFn from "./FormMiseAJourIndicateurs.schema";
import { addState } from "@/api/plans.api";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormMiseAJourIndicateursInfo from "./sections/FormMiseAJourIndicateursInfo.vue";
import FormMiseAjourIndicateursDate from "./sections/FormMiseAJourIndicateursDate.vue";
import FormMiseAJourIndicateursAudience from "./sections/FormMiseAJourIndicateursAudience.vue";
import FormMiseAJourIndicateursTeam from "./sections/FormMiseAJourIndicateursTeam.vue";
import FormMiseAJourIndicateursDroitsCommuns from "./sections/FormMiseAjourIndicateursDroitsCommuns.vue";
import FormMiseAJourIndicateursSante from "./sections/FormMiseAJourIndicateursSante.vue";
import FormMiseAJourIndicateursEducation from "./sections/FormMiseAJourIndicateursEducation.vue";
import FormMiseAJourIndicateursEmploi from "./sections/FormMiseAJourIndicateursEmploi.vue";
import FormMiseAJourIndicateursLogement from "./sections/FormMiseAJourIndicateursLogement.vue";
import FormMiseAJourIndicateursSecurite from "./sections/FormMiseAJourIndicateursSecurite.vue";

const props = defineProps({
    plan: Object,
});
const { plan } = toRefs(props);

const lastState = plan.value.states.slice(-1)[0];
const initialValues = {
    etp: lastState.etp.map((el) => {
        return { total: el.total, type: el.type.uid };
    }),
    ...lastState.droit_commun,
    ...lastState.sante,
    ...lastState.education,
    ...lastState.formation,
    ...lastState.logement,
    ...lastState.securisation,
};

const validationSchema = schemaFn(plan.value.topics);
const { handleSubmit, values, errors, setErrors } = useForm({
    validationSchema,
    initialValues,
});

const error = ref(null);

const topics = computed(() => {
    return plan.value.topics.map(({ uid }) => uid);
});

const tabs = computed(() => {
    const s = [{ id: "date", label: "Date d'actualisation", route: "#date" }];
    if (values.date) {
        s.push(
            ...[
                {
                    id: "audience",
                    label: "Entrées et sorties",
                    route: "#audience",
                },
                { id: "team", label: "Équipe", route: "#team" },
                {
                    id: "droits_communs",
                    label: "Droits communs et ressources",
                    route: "#droits_communs",
                },
            ]
        );
        if (topics.value.includes("health")) {
            s.push({ id: "sante", label: "Santé", route: "#sante" });
        }
        if (topics.value.includes("school")) {
            s.push({
                id: "education",
                label: "Éducation et scolarisation",
                route: "#education",
            });
        }
        if (topics.value.includes("work")) {
            s.push({
                id: "emploi",
                label: "Formation et emploi",
                route: "#emploi",
            });
        }
        if (topics.value.includes("housing")) {
            s.push({ id: "logement", label: "Logement", route: "#logement" });
        }
        if (topics.value.includes("safety")) {
            s.push({
                id: "securite",
                label: "Stabilisation et sécurisation du site",
                route: "#securite",
            });
        }
    }
    return s;
});

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        error.value = null;

        try {
            const notificationStore = useNotificationStore();
            const plansStore = usePlansStore();

            const result = await addState(plan.value.id, sentValues);
            trackEvent(
                "Dispositif",
                "Mise à jour indicateurs",
                `S${plan.value.id}`
            );

            notificationStore.success(
                "Succès",
                "Les indicateurs ont bien été enregistrés"
            );
            plansStore.hash.value[plan.value.id] = result;
            router.push(`/action/${plan.value.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
});
</script>
