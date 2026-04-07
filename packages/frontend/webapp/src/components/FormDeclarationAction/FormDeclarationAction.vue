<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>
        <IndicationCaractereObligatoire class="mb-6" />

        <FormDeclarationActionCaracteristiques class="mt-6" :mode="mode" />
        <FormDeclarationActionLocalisation
            :disableDepartement="mode === 'edit' && !canAccessFinances"
            :setFieldValue="setFieldValue"
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
    toRaw,
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
import { useModaleStore } from "@/stores/modale.store";
import { trackEvent } from "@/helpers/matomo";
import router from "@/helpers/router";
import _ from "lodash-es";
import backOrReplace from "@/utils/backOrReplace";
import {
    formatFormAction,
    fields as INDICATEURS_YEAR_KEYS,
} from "@/utils/formatFormAction";
import { normalizeShantytownIds } from "@/utils/normalizeShantytownIds";
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
const emit = defineEmits(["submitted-successfully"]);

const userStore = useUserStore();
const modaleStore = useModaleStore();
const pendingSubmit = ref(null);
const originalFinances = ref(null);

const mode = computed(() => {
    return action.value === null ? "create" : "edit";
});
const validationSchema = schemaFn(mode.value);
const {
    handleSubmit,
    values,
    errors,
    setErrors,
    isSubmitting,
    resetForm,
    setFieldValue,
} = useForm({
    validationSchema,
    keepValuesOnUnmount: true,
    initialValues: formatFormAction(
        action.value || {
            location_departement: userStore.departementsForActions[0]?.code,
        }
    ),
});

const managerIds = ref([]);

function cloneValue(value) {
    if (value == null) {
        return value;
    }

    const rawValue = toRaw(value);

    if (typeof structuredClone === "function") {
        return structuredClone(rawValue);
    }

    return JSON.parse(JSON.stringify(rawValue));
}

if (action.value && action.value.finances) {
    originalFinances.value = cloneValue(action.value.finances);
}

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
    // Transformer les données de l'API vers le format attendu par le formulaire
    const formattedForForm = formatValuesFromApi(initialFormValues);
    resetForm({ values: formattedForForm });
    await nextTick();
    originalValues.value = formatValuesForApi(formattedForForm);
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
const hasDuplicates = ref(false);

const DUPLICATE_ERROR_MESSAGE =
    "Des adresses en double ont été détectées. Veuillez corriger les doublons avant de pouvoir enregistrer l'action.";

// Computed property pour savoir s'il y a des erreurs
const hasErrors = computed(
    () => error.value !== null || Object.keys(errors.value).length > 0
);

function normalizeAddressForComparison(address) {
    return String(address)
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .replaceAll(/['''\u2019]/g, "'")
        .toLowerCase()
        .trim();
}

function createAddressKey(addr) {
    const normalizedAddress = normalizeAddressForComparison(addr.address);
    return `${normalizedAddress}|${addr.citycode}|${addr.coordinates}`;
}

function findDuplicateAddresses(addresses) {
    if (!addresses || addresses.length <= 1) {
        return [];
    }

    const seenAddresses = new Set();
    const duplicates = [];

    addresses.forEach((addr, index) => {
        if (addr.address && addr.citycode && addr.coordinates) {
            const addressKey = createAddressKey(addr);
            if (seenAddresses.has(addressKey)) {
                duplicates.push({ index, ...addr });
            } else {
                seenAddresses.add(addressKey);
            }
        }
    });

    return duplicates;
}

function addDuplicateErrorMessage() {
    if (error.value && !error.value.includes(DUPLICATE_ERROR_MESSAGE)) {
        error.value = `${error.value}\n\n${DUPLICATE_ERROR_MESSAGE}`;
    } else if (!error.value) {
        error.value = DUPLICATE_ERROR_MESSAGE;
    }
}

function removeDuplicateErrorMessage() {
    if (error.value?.includes(DUPLICATE_ERROR_MESSAGE)) {
        error.value =
            error.value
                .replaceAll(`\n\n${DUPLICATE_ERROR_MESSAGE}`, "")
                .trim() || null;
    }
}

function updateHasChanges() {
    if (!originalValues.value) {
        return;
    }

    const currentFormatted = formatValuesForApi(values);
    const duplicates = findDuplicateAddresses(
        currentFormatted.location_eti_addresses
    );

    if (duplicates.length > 0) {
        hasDuplicates.value = true;
        hasChanges.value = true;
        addDuplicateErrorMessage();
    } else {
        hasDuplicates.value = false;
        removeDuplicateErrorMessage();
    }

    hasChanges.value = !_.isEqual(originalValues.value, currentFormatted);
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

// Transformer les données de l'API vers le format attendu par le formulaire
function formatValuesFromApi(v) {
    if (v.location_eti_addresses && Array.isArray(v.location_eti_addresses)) {
        return {
            ...v,
            location_eti_addresses: v.location_eti_addresses.map((addr) => {
                // Si address est déjà un objet avec data, on le garde
                if (addr.address && typeof addr.address === "object") {
                    return addr;
                }
                // Sinon, on reconstruit la structure attendue par InputAddress
                return {
                    ...addr,
                    address: {
                        data: {
                            label: addr.address,
                            citycode: addr.citycode,
                            coordinates:
                                addr.coordinates?.split(",").map(Number) || [],
                        },
                    },
                };
            }),
        };
    }
    return v;
}

function formatValuesForApi(v) {
    const endedAt = formatFormDate(v.ended_at);

    // Transformer les adresses ETI multiples pour l'API
    let locationEtiAddresses = null;
    if (
        v.location_type === "eti" &&
        v.location_eti_addresses &&
        Array.isArray(v.location_eti_addresses)
    ) {
        const validAddresses = v.location_eti_addresses.filter(
            (addr) => addr.address?.data?.label && addr.address?.data?.citycode
        );

        if (validAddresses.length > 0) {
            locationEtiAddresses = validAddresses.map((addr) => {
                const coords =
                    addr.coordinates || addr.address.data.coordinates;
                return {
                    address: addr.address.data.label,
                    citycode: addr.address.data.citycode,
                    coordinates: Array.isArray(coords)
                        ? `${coords[0]},${coords[1]}`
                        : coords,
                };
            });
        }
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
            ended_at: endedAt === null ? undefined : endedAt,
            topics: Array.isArray(v.topics)
                ? [...v.topics].sort((a, b) =>
                      a.localeCompare(b, "fr", { sensitivity: "base" })
                  )
                : v.topics,
            location_shantytowns: normalizeShantytownIds(
                v.location_shantytowns
            ),
            managers: v.managers.users.map(({ id }) => id),
            operators: v.operators.users.map(({ id }) => id),
            location_eti_addresses: locationEtiAddresses,
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
                if (yearValues && Object.keys(yearValues).length > 0) {
                    const sortedKeys = [
                        ...new Set([
                            ...Object.keys(yearValues),
                            ...INDICATEURS_YEAR_KEYS,
                        ]),
                    ].sort((a, b) =>
                        a.localeCompare(b, "fr", { sensitivity: "base" })
                    );

                    acc[year] = sortedKeys.reduce((yearAcc, key) => {
                        const value = yearValues[key];
                        yearAcc[key] = value === "" ? null : value ?? null;
                        return yearAcc;
                    }, {});
                }
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

function getYearFromDateValue(value) {
    if (value == null || value === "") {
        return null;
    }

    const dateValue = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(dateValue.getTime())) {
        return null;
    }

    return dateValue.getFullYear();
}

function checkFundingDeletions(sentValues) {
    if (mode.value !== "edit" || !action.value || !originalFinances.value) {
        return null;
    }

    const oldStartYear = getYearFromDateValue(action.value.started_at);
    const oldEndYear = getYearFromDateValue(action.value.ended_at);
    const newStartYear = getYearFromDateValue(sentValues.started_at);
    const newEndYear = getYearFromDateValue(sentValues.ended_at);

    const minYearChanged = oldStartYear !== newStartYear;
    const maxYearChanged = oldEndYear !== newEndYear;

    if (!minYearChanged && !maxYearChanged) {
        return null;
    }

    const yearsBeforeMin = [];
    const yearsAfterMax = [];

    Object.keys(originalFinances.value).forEach((strYear) => {
        const year = Number.parseInt(strYear, 10);
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

    // 🔍 Vérifier les doublons d'adresses ETI
    if (formattedValues.location_eti_addresses) {
        const seenAddresses = new Set();
        const duplicates = [];

        formattedValues.location_eti_addresses.forEach((addr, index) => {
            if (addr.address && addr.citycode && addr.coordinates) {
                // Normaliser la chaîne pour éviter les problèmes d'apostrophes typographiques
                const normalizedAddress = String(addr.address)
                    .normalize("NFD")
                    .replaceAll(/[\u0300-\u036f]/g, "")
                    .replaceAll(/['''\u2019]/g, "'")
                    .toLowerCase()
                    .trim();
                const addressKey = String(
                    `${normalizedAddress}|${String(addr.citycode)}|${String(
                        addr.coordinates
                    )}`
                );
                if (seenAddresses.has(addressKey)) {
                    duplicates.push({
                        index,
                        address: addr.address,
                        citycode: addr.citycode,
                        coordinates: addr.coordinates,
                    });
                } else {
                    seenAddresses.add(addressKey);
                }
            }
        });

        if (duplicates.length > 0) {
            router.replace("#erreurs");
            error.value =
                "Impossible de sauvegarder : des adresses en double ont été détectées";
            return;
        }
    }

    if (
        mode.value === "edit" &&
        _.isEqual(originalValues.value, formattedValues)
    ) {
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
        emit("submitted-successfully", respondedAction?.id);
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
    hasChanges,
    hasErrors,
    hasDuplicates,
    isSubmitting,
});
</script>
