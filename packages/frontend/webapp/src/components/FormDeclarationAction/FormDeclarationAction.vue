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
import {
    toRefs,
    toRef,
    computed,
    ref,
    watch,
    nextTick,
    onBeforeUnmount,
} from "vue";
import { useForm, useFieldValue, useFormErrors } from "vee-validate";
import { useActionsStore } from "@/stores/actions.store";
import { useUserStore } from "@/stores/user.store";
import { useConfigStore } from "@/stores/config.store";
import { useNotificationStore } from "@/stores/notification.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import _ from "lodash-es";
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
import schemaFn from "./FormDeclarationAction.schema";

const props = defineProps({
    action: {
        type: Object,
        required: false,
        default: null,
    },
});
const emit = defineEmits(["submitted-successfully"]);
const { action } = toRefs(props);

const userStore = useUserStore();

const mode = computed(() => {
    return action.value === null ? "create" : "edit";
});
const validationSchema = schemaFn(mode.value);
const { handleSubmit, values, errors, setErrors, isSubmitting, resetForm } =
    useForm({
        validationSchema,
        keepValuesOnUnmount: true,
        initialValues: formatFormAction(
            action.value || {
                location_departement: userStore.departementsForActions[0]?.code,
            }
        ),
    });

const managerIds = ref([]);

const INDICATEURS_YEAR_KEYS = [
    "nombre_personnes",
    "nombre_menages",
    "nombre_femmes",
    "nombre_mineurs",
    "sante_nombre_personnes",
    "travail_nombre_personnes",
    "travail_nombre_femmes",
    "hebergement_nombre_personnes",
    "hebergement_nombre_menages",
    "logement_nombre_personnes",
    "logement_nombre_menages",
    "scolaire_mineurs_scolarisables",
    "scolaire_mineurs_en_mediation",
    "scolaire_nombre_maternelle",
    "scolaire_nombre_elementaire",
    "scolaire_nombre_college",
    "scolaire_nombre_lycee",
    "scolaire_nombre_autre",
];

watch(
    toRef(values, "managers"),
    () => {
        managerIds.value = values.managers.users.map(({ id }) => id);
    },
    { deep: true }
);

const originalValues = ref(null);

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

async function initFromAction(initialFormValues) {
    resetForm({ values: initialFormValues });
    await nextTick();
    originalValues.value = formatValuesForApi(initialFormValues);
}

watch(
    action,
    (newAction) => {
        const initialFormValues = formatFormAction(
            newAction || {
                location_departement: userStore.departementsForActions[0]?.code,
            }
        );
        initFromAction(initialFormValues);
    },
    { immediate: true }
);

const hasChanges = ref(false);

function updateHasChanges() {
    if (originalValues.value === null) {
        hasChanges.value = false;
        return;
    }

    hasChanges.value = !_.isEqual(
        originalValues.value,
        formatValuesForApi(values)
    );
}

const debouncedUpdateHasChanges = _.debounce(updateHasChanges, 250);

watch(
    originalValues,
    () => {
        debouncedUpdateHasChanges.cancel();
        updateHasChanges();
    },
    { immediate: true }
);

watch(
    values,
    () => {
        debouncedUpdateHasChanges();
    },
    { deep: true }
);

onBeforeUnmount(() => {
    debouncedUpdateHasChanges.cancel();
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
    const endedAt = formatFormDate(v.ended_at);

    if (v.location_eti?.data) {
        ({ citycode, label } = v.location_eti.data);
    }

    const formatted = {
        ...Object.keys(validationSchema.fields).reduce((acc, key) => {
            if (key === "ended_at") {
                return acc;
            }
            acc[key] = v[key] ? JSON.parse(JSON.stringify(v[key])) : v[key];
            return acc;
        }, {}),
        ...{
            started_at: formatFormDate(v.started_at),
            ended_at: endedAt !== null ? endedAt : undefined,
            topics: Array.isArray(v.topics)
                ? [...v.topics].sort((a, b) =>
                      a.localeCompare(b, "fr", { sensitivity: "base" })
                  )
                : v.topics,
            location_shantytowns: Array.isArray(v.location_shantytowns)
                ? [...v.location_shantytowns]
                      .sort((a, b) =>
                          `${a}`.localeCompare(`${b}`, "fr", {
                              sensitivity: "base",
                          })
                      )
                      .map((id) => Number.parseInt(id, 10))
                      .filter((id) => !Number.isNaN(id))
                : v.location_shantytowns,
            managers: v.managers.users.map(({ id }) => id),
            operators: v.operators.users.map(({ id }) => id),
            location_eti_citycode: citycode,
            location_eti: label,
            location_eti_coordinates: v.location_eti_coordinates
                ? `${v.location_eti_coordinates[0]},${v.location_eti_coordinates[1]}`
                : "",
        },
    };

    if (formatted.finances && typeof formatted.finances === "object") {
        formatted.finances = Object.entries(formatted.finances).reduce(
            (acc, [year, rows]) => {
                const normalizedRows = (rows || []).map((row) => {
                    const amount = Number.parseInt(row?.amount, 10);
                    const realAmount = Number.parseInt(row?.real_amount, 10);

                    return {
                        ...row,
                        amount: Number.isNaN(amount) ? null : amount,
                        real_amount: Number.isNaN(realAmount)
                            ? null
                            : realAmount,
                    };
                });

                // Ne renvoyer que les années avec des données
                if (normalizedRows.length > 0) {
                    acc[year] = normalizedRows;
                }

                return acc;
            },
            {}
        );
    }

    // Analyse des indicateurs : on s'assure que les années attendues sont présentes, même si elles n'ont pas de données
    if (formatted.indicateurs && typeof formatted.indicateurs === "object") {
        formatted.indicateurs = Object.entries(formatted.indicateurs).reduce(
            (acc, [year, yearValues]) => {
                const source = yearValues || {};
                const sortedKeys = [
                    ...new Set([
                        ...Object.keys(source),
                        ...INDICATEURS_YEAR_KEYS,
                    ]),
                ].sort((a, b) =>
                    a.localeCompare(b, "fr", { sensitivity: "base" })
                );

                acc[year] = sortedKeys.reduce((yearAcc, key) => {
                    const value = source[key];
                    yearAcc[key] = value === "" ? null : value ?? null;
                    return yearAcc;
                }, {});

                return acc;
            },
            {}
        );
    }

    return formatted;
}

watch(useFormErrors(), () => {
    if (Object.keys(errors.value).length === 0) {
        error.value = null;
    }
});

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues);

        if (
            mode.value === "edit" &&
            _.isEqual(originalValues.value, formattedValues)
        ) {
            router.replace("#erreurs");
            error.value =
                "Modification impossible : aucun champ n'a été modifié";
            return;
        }

        error.value = null;

        try {
            const notificationStore = useNotificationStore();

            const { submit, notification } = config[mode.value];
            const respondedAction = await submit(
                formattedValues,
                action.value?.id
            );

            notificationStore.success(notification.title, notification.content);
            emit("submitted-successfully", respondedAction?.id);
            backOrReplace(`/action/${respondedAction.id}`);
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                setErrors(e.fields);
            }
        }
    }),
    hasChanges,
    isSubmitting,
});
</script>
