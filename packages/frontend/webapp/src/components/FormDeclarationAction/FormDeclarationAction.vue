<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>
        <IndicationCaractereObligatoire class="mb-6" />

        <FormDeclarationActionCaracteristiques class="mt-6" :mode="mode" />
        <FormDeclarationActionLocalisation
            :disableDepartement="mode === 'edit' && !canAccessFinances"
            class="mt-6"
        />
        <FormDeclarationActionContacts
            :disableManagers="mode === 'edit' && !canAccessFinances"
            class="mt-6"
        />

        <FormDeclarationActionFinances
            class="mt-6"
            v-if="canAccessFinances"
            :managers="managerIds"
            :departement="departement"
        />
        <FormDeclarationActionIndicateurs class="mt-6" />

        <ErrorSummary
            id="erreurs"
            class="mt-12"
            v-if="error || Object.keys(errors).length > 0"
            :message="error"
            :summary="errors"
        />
    </ArrangementLeftMenu>
</template>

<script setup>
import { toRefs, toRef, computed, ref, watch } from "vue";
import { useForm, useFieldValue, useFormErrors } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { useModaleStore } from "@/stores/modale.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import isDeepEqual from "@/utils/isDeepEqual";
import backOrReplace from "@/utils/backOrReplace";
import formatFormAction from "@/utils/formatFormAction";
import formatFormDate from "@common/utils/formatFormDate";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormDeclarationActionCaracteristiques from "./sections/FormDeclarationActionCaracteristiques.vue";
import FormDeclarationActionLocalisation from "./sections/FormDeclarationActionLocalisation.vue";
import FormDeclarationActionContacts from "./sections/FormDeclarationActionContacts.vue";
import FormDeclarationActionFinances from "./sections/FormDeclarationActionFinances.vue";
import FormDeclarationActionIndicateurs from "./sections/FormDeclarationActionIndicateurs.vue";
import IndicationCaractereObligatoire from "@/components/IndicationCaractereObligatoire/IndicationCaractereObligatoire.vue";
import ModaleConfirmationSuppressionFinancements from "@/components/ModaleConfirmationSuppressionFinancements/ModaleConfirmationSuppressionFinancements.vue";
import schemaFn from "./FormDeclarationAction.schema";

const props = defineProps({
    action: {
        type: Object,
        required: false,
        default: null,
    },
});
const { action } = toRefs(props);

const userStore = useUserStore();
const modaleStore = useModaleStore();
const pendingSubmit = ref(null);
const originalFinances = ref(null);

const mode = computed(() => {
    return action.value === null ? "create" : "edit";
});
const validationSchema = schemaFn(mode.value);
const { handleSubmit, values, errors, setErrors, isSubmitting } = useForm({
    validationSchema,
    initialValues: formatFormAction(
        action.value || {
            location_departement: userStore.departementsForActions[0]?.code,
        }
    ),
});

const managerIds = ref([]);

if (action.value && action.value.finances) {
    originalFinances.value = JSON.parse(JSON.stringify(action.value.finances));
}

watch(
    toRef(values, "managers"),
    () => {
        managerIds.value = values.managers.users.map(({ id }) => id);
    },
    { deep: true }
);

const originalValues = formatValuesForApi(values);
const actionsStore = useActionsStore();
const error = ref(null);
const departement = useFieldValue("location_departement");
const canAccessFinances = computed(() => {
    const configStore = useConfigStore();
    const fullDepartement = configStore.config.departements.find(
        ({ code }) => code === departement.value
    );

    return userStore.hasActionPermission("action_finances.access", {
        id: action.value?.id,
        location: {
            departement: {
                code: departement.value,
            },
            region: {
                code: fullDepartement?.region,
            },
        },
    });
});

const tabs = computed(() => {
    const arr = [
        {
            id: "intervention",
            label: "Intervention",
            route: "#intervention",
        },
        {
            id: "lieu",
            label: "Lieu",
            route: "#lieu",
        },
        {
            id: "contacts",
            label: "Contacts",
            route: "#contacts",
        },
    ];

    if (canAccessFinances.value === true) {
        arr.push({
            id: "financements",
            label: "Financements",
            route: "#financements",
        });
    }

    arr.push({
        id: "indicateurs",
        label: "Indicateurs",
        route: "#indicateurs",
    });

    return arr;
});

const config = {
    create: {
        async submit(values) {
            const action = await actionsStore.create(values);
            trackEvent("Action", "Création action", `A${action.id}`);
            return action;
        },
        notification: {
            title: "Déclaration réussie",
            content:
                "L'action a été déclarée, et les acteurs concernés ont été prévenus par mail",
        },
    },
    edit: {
        async submit(values, id) {
            const action = await actionsStore.edit(id, values);
            trackEvent("Action", "Mise à jour action", `A${id}`);
            return action;
        },
        notification: {
            title: "Mise à jour réussie",
            content: "L'action a bien été mise à jour",
        },
    },
};

function formatValuesForApi(v) {
    let citycode = null;
    let label = null;
    if (v.location_eti?.data) {
        ({ citycode, label } = v.location_eti.data);
    }

    return {
        ...Object.keys(validationSchema.fields).reduce((acc, key) => {
            acc[key] = v[key] ? JSON.parse(JSON.stringify(v[key])) : v[key];
            return acc;
        }, {}),
        ...{
            started_at: formatFormDate(v.started_at),
            ended_at: formatFormDate(v.ended_at),
            managers: v.managers.users.map(({ id }) => id),
            operators: v.operators.users.map(({ id }) => id),
            location_eti_citycode: citycode,
            location_eti: label,
            location_eti_coordinates: v.location_eti_coordinates
                ? `${v.location_eti_coordinates[0]},${v.location_eti_coordinates[1]}`
                : "",
        },
    };
}

watch(useFormErrors(), () => {
    if (Object.keys(errors.value).length === 0) {
        error.value = null;
    }
});

function checkFundingDeletions(sentValues) {
    if (mode.value !== "edit" || !action.value || !originalFinances.value) {
        return null;
    }

    const oldStartYear = action.value.started_at
        ? new Date(action.value.started_at).getFullYear()
        : null;
    const oldEndYear = action.value.ended_at
        ? new Date(action.value.ended_at).getFullYear()
        : null;
    const newStartYear = sentValues.started_at
        ? sentValues.started_at.getFullYear()
        : null;
    const newEndYear = sentValues.ended_at
        ? sentValues.ended_at.getFullYear()
        : null;

    const minYearChanged = oldStartYear !== newStartYear;
    const maxYearChanged = oldEndYear !== newEndYear;

    if (!minYearChanged && !maxYearChanged) {
        return null;
    }

    const yearsBeforeMin = [];
    const yearsAfterMax = [];

    Object.keys(originalFinances.value).forEach((strYear) => {
        const year = parseInt(strYear, 10);
        const hasData =
            originalFinances.value[strYear] &&
            originalFinances.value[strYear].length > 0;

        if (hasData && newStartYear && year < newStartYear) {
            yearsBeforeMin.push(strYear);
        }
        if (hasData && newEndYear && year > newEndYear) {
            yearsAfterMax.push(strYear);
        }
    });

    if (yearsBeforeMin.length === 0 && yearsAfterMax.length === 0) {
        return null;
    }

    return {
        yearsBeforeMin,
        yearsAfterMax,
        minYear: newStartYear,
        maxYear: newEndYear,
        minYearChanged,
        maxYearChanged,
        finances: originalFinances.value,
    };
}

async function performSubmit(sentValues) {
    const formattedValues = formatValuesForApi(sentValues);

    if (mode.value === "edit" && isDeepEqual(originalValues, formattedValues)) {
        router.replace("#erreurs");
        error.value = "Modification impossible : aucun champ n'a été modifié";
        return;
    }

    error.value = null;

    try {
        const notificationStore = useNotificationStore();

        const { submit, notification } = config[mode.value];
        const respondedAction = await submit(formattedValues, action.value?.id);

        notificationStore.success(notification.title, notification.content);
        backOrReplace(`/action/${respondedAction.id}`);
    } catch (e) {
        error.value = e?.user_message || "Une erreur inconnue est survenue";
        if (e?.fields) {
            setErrors(e.fields);
        }
    } finally {
        pendingSubmit.value = null;
    }
}

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const deletionInfo = checkFundingDeletions(sentValues);

        if (deletionInfo) {
            pendingSubmit.value = sentValues;
            modaleStore.open(ModaleConfirmationSuppressionFinancements, {
                ...deletionInfo,
                onConfirm: () => {
                    modaleStore.close();
                    performSubmit(pendingSubmit.value);
                },
                onCancel: () => {
                    modaleStore.close();
                    pendingSubmit.value = null;
                },
            });
        } else {
            await performSubmit(sentValues);
        }
    }),
    isSubmitting,
});
</script>
