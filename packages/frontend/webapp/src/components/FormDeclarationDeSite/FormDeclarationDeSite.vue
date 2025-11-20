<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>
        <IndicationCaractereObligatoire />

        <FormDeclarationDeSiteInfo v-if="town === null" :mode="mode" />
        <FormDeclarationDeSiteDateDeMaj
            v-else-if="canSetUpdatedAt"
            :minDate="minUpdatedAt"
        />
        <FormDeclarationDeSiteResorption
            v-if="town && hasPreparatoryPhases"
            class="mt-6"
        />
        <FormDeclarationDeSiteAdresse :townId="town?.id" class="mt-6" />
        <FormDeclarationDeSiteCaracteristiques
            class="mt-6"
            :set_field_value="setFieldValue"
        />
        <FormDeclarationDeSiteHabitants
            :location="location"
            :townId="town?.id"
            class="mt-6"
        />
        <FormDeclarationDeSiteConditionsDeVie
            :version="town ? town.livingConditions.version : 2"
            class="mt-6"
        />
        <FormDeclarationDeSiteConditionsDeVieV1
            v-if="values.show_old_living_conditions"
            :town="town"
            class="mt-6"
        />
        <FormDeclarationDeSiteProcedure
            class="mt-6"
            v-if="hasJusticePermission"
            :location="location"
            :mode="mode"
            :townId="town?.id"
            @delete:OriginalAttachment="deleteOriginalAttachment"
        />

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
    computed,
    defineExpose,
    defineProps,
    ref,
    toRef,
    toRefs,
    watch,
} from "vue";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/user.store";
import { useTownsStore } from "@/stores/towns.store";
import { useNotificationStore } from "@/stores/notification.store";
import * as locationsApi from "@/api/locations.api";
import { report } from "@/api/towns.api";
import { trackEvent } from "@/helpers/matomo";
import isDeepEqual from "@/utils/isDeepEqual";
import backOrReplace from "@/utils/backOrReplace";
import formatFormTown from "@common/utils/formatFormTown";
import formatFormDate from "@common/utils/formatFormDate";
import focusFirstErrorField from "@/utils/focusFirstErrorField";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormDeclarationDeSiteInfo from "./sections/FormDeclarationDeSiteInfo.vue";
import FormDeclarationDeSiteDateDeMaj from "./sections/FormDeclarationDeSiteDateDeMaj.vue";
import FormDeclarationDeSiteResorption from "./sections/FormDeclarationDeSiteResorption.vue";
import FormDeclarationDeSiteAdresse from "./sections/FormDeclarationDeSiteAdresse.vue";
import FormDeclarationDeSiteCaracteristiques from "./sections/FormDeclarationDeSiteCaracteristiques.vue";
import FormDeclarationDeSiteHabitants from "./sections/FormDeclarationDeSiteHabitants.vue";
import FormDeclarationDeSiteConditionsDeVie from "./sections/FormDeclarationDeSiteConditionsDeVie.vue";
import FormDeclarationDeSiteConditionsDeVieV1 from "./sections/FormDeclarationDeSiteConditionsDeVieV1.vue";
import IndicationCaractereObligatoire from "@/components/IndicationCaractereObligatoire/IndicationCaractereObligatoire.vue";
import FormDeclarationDeSiteProcedure from "./sections/FormDeclarationDeSiteProcedure.vue";
import schemaFn from "./FormDeclarationDeSite.schema";

const props = defineProps({
    town: {
        type: Object,
        required: false,
        default: null,
    },
    mode: {
        type: String,
        required: true,
    },
});
const { mode, town } = toRefs(props);

const initialValues = {
    update_to_date: 1,
    living_conditions_version: town.value?.livingConditions?.version || 2,
    show_old_living_conditions: false,
    ...formatFormTown(town.value || {}),
    attachments: town.value?.attachments || [],
};

const canSetUpdatedAt = computed(() => {
    if (!town.value) {
        return false;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const updatedAt = new Date(town.value.updatedAt * 1000);
    updatedAt.setHours(0, 0, 0, 0);

    return updatedAt < yesterday;
});

const minUpdatedAt = computed(() => {
    if (!town.value) {
        return null;
    }

    const updatedAt = new Date(town.value.updatedAt * 1000);
    updatedAt.setHours(0, 0, 0, 0);
    updatedAt.setDate(updatedAt.getDate() + 1);

    return updatedAt;
});

const townsStore = useTownsStore();
const userStore = useUserStore();
const location = ref(
    town.value
        ? {
              type: "city",
              city: town.value.city,
              epci: town.value.epci,
              departement: town.value.departement,
              region: town.value.region,
          }
        : null
);

const hasJusticePermission = computed(() => {
    if (!location.value) {
        return false;
    }

    return userStore.hasLocalizedPermission(
        "shantytown_justice.access",
        location.value
    );
});

const hasOwnerPermission = computed(() => {
    if (!location.value) {
        return false;
    }

    return userStore.hasLocalizedPermission(
        "shantytown_owner.access",
        location.value
    );
});

const validationSchema = schemaFn(
    hasJusticePermission,
    hasOwnerPermission,
    mode.value
);
const { handleSubmit, values, errors, setErrors, isSubmitting, setFieldValue } =
    useForm({
        validationSchema,
        initialValues,
    });

const originalValues = formatValuesForApi(values, "init");
const error = ref(null);
const address = toRef(values, "address");

watch(address, async () => {
    location.value = null;

    if (address.value?.data?.citycode) {
        try {
            location.value = await locationsApi.get(
                "city",
                address.value.data.citycode
            );
        } catch (e) {
            console.log("Failed fetching more information about the city", e);
        }
    }
});

// Watch pour le focus automatique sur les erreurs de validation
watch(errors, (newErrors) => {
    if (Object.keys(newErrors).length > 0) {
        focusFirstErrorField(newErrors);
    }
});

const tabs = computed(() => {
    const arr = [
        {
            id: "resorption",
            label: "Phases préparatoires à la résorption",
            route: "#resorption",
        },
        {
            id: "adresse",
            label: "Localisation",
            route: "#adresse",
        },
        {
            id: "caracteristiques",
            label: "Caractéristiques du site",
            route: "#caracteristiques",
        },
        {
            id: "habitants",
            label: "Habitants",
            route: "#habitants",
        },
        {
            id: "conditions_de_vie",
            label: "Conditions de vie et environnement",
            route: "#conditions_de_vie",
        },
    ];

    if (values.show_old_living_conditions === true) {
        arr.push({
            id: "anciennes_conditions_de_vie",
            label: "Anciennes conditions de vie",
            route: "#anciennes_conditions_de_vie",
        });
    }

    if (hasJusticePermission.value) {
        arr.push({
            id: "procedure",
            label: "Procédure",
            route: "#procedure",
        });
    }

    return town.value?.preparatoryPhasesTowardResorption.length > 0
        ? arr
        : arr.filter((tab) => tab.id !== "resorption");
});

const config = {
    create: {
        async submit(values) {
            const town = await townsStore.create(values);
            trackEvent("Site", "Création site", `S${town.id}`);
            return town;
        },
        notification: {
            title: "Déclaration réussie",
            content:
                "Le site a été déclaré, et les acteurs concernés ont été prévenus par mail",
        },
    },
    report: {
        async submit(values) {
            await report(values);
        },
        notification: {
            title: "Signalement réussi",
            content:
                "Les données renseignées ont été transmises par mail aux administrateurs nationaux",
        },
    },
    edit: {
        async submit(values, id) {
            const town = await townsStore.edit(id, values);
            trackEvent("Site", "Mise à jour site", `S${id}`);
            return town;
        },
    },
};

function formatValuesForApi(v, initOrEdit) {
    let citycode = null;
    let label = null;
    if (v.address?.data) {
        ({ citycode, label } = v.address.data);
    }

    const formatDateFields = (fields, obj) => {
        return fields.reduce((acc, field) => {
            acc[field] =
                obj[field] === null ? null : formatFormDate(obj[field]);
            return acc;
        }, {});
    };

    const handleNullFields = (fields, obj) => {
        return fields.reduce((acc, field) => {
            acc[field] = obj[field] === "null" ? null : obj[field];
            return acc;
        }, {});
    };

    const formatAttachments = (attachments, attachmentType) => {
        return attachments.map((file) => ({
            file: file,
            type: attachmentType,
        }));
    };

    const dateFields = [
        "built_at",
        "declared_at",
        "census_conducted_at",
        "justice_rendered_at",
        "police_requested_at",
        "police_granted_at",
        "administrative_order_decision_at",
        "administrative_order_evacuation_at",
        "insalubrity_order_at",
    ];

    const nullFields = [
        "census_status",
        "police_status",
        "evacuation_under_time_limit",
        "existing_litigation",
        "insalubrity_order_type",
        "insalubrity_order_by",
    ];

    const completeAttachments = [];

    const attachmentTypes = [
        { key: "justice_rendered_attachments", type: "justice_rendered" },
        { key: "insalubrity_attachments", type: "insalubrity" },
        { key: "evacuation_attachments", type: "evacuation" },
    ];

    attachmentTypes.forEach(({ key, type }) => {
        if (v[key] && v[key].length > 0) {
            completeAttachments.push(
                ...formatAttachments(Array.from(v[key]), type)
            );
        }
    });

    const result = {
        ...Object.keys(validationSchema.value.fields).reduce((acc, key) => {
            // Normaliser undefined en null pour la cohérence
            acc[key] = v[key] === undefined ? null : v[key];
            return acc;
        }, {}),
        ...formatDateFields(dateFields, v),
        ...handleNullFields(nullFields, v),
        living_conditions_version: v.living_conditions_version || 2,
        updated_at: v.updated_at || new Date(),
        citycode,
        address: label,
        coordinates: `${v.coordinates[0]},${v.coordinates[1]}`,
        existingAttachments: Array.from(v.attachments || []),
        newAttachments: completeAttachments,
        preparatory_phases_toward_resorption: Array.from(
            v.preparatory_phases_toward_resorption || []
        ),
        terminated_preparatory_phases_toward_resorption:
            buildTerminatedPreparatoryPhases(initOrEdit),
        owners: buildOwners(v.owners),
    };

    // Normaliser les tableaux (convertir Proxy en Array)
    for (const key of Object.keys(result)) {
        if (
            result[key] &&
            typeof result[key] === "object" &&
            typeof result[key][Symbol.iterator] === "function" &&
            !Array.isArray(result[key])
        ) {
            result[key] = Array.from(result[key]);
        }
    }

    return result;
}

const deleteOriginalAttachment = (attachments) => {
    originalValues.existingAttachments = attachments;
};

function buildOwners(ownerDatas) {
    if (!ownerDatas || !Array.isArray(ownerDatas)) {
        return [];
    }
    return {
        ...ownerDatas,
        owners: ownerDatas.owners.map((owner) => {
            const newOwner = { ...owner };
            delete newOwner._key;
            return newOwner;
        }),
    };
}

function buildTerminatedPreparatoryPhases(initOrEdit) {
    const terminatedPreparatoryPhases = {};
    if (initOrEdit === "init") {
        for (const phase of values.active_preparatory_phases_toward_resorption) {
            if (phase.completedAt !== null) {
                terminatedPreparatoryPhases[phase.preparatoryPhaseId] =
                    phase.completedAt;
            }
        }
    } else if (initOrEdit === "edit") {
        for (const phase of values.preparatory_phases_toward_resorption) {
            if (values[`phase_${phase}_completed_at`] !== null) {
                terminatedPreparatoryPhases[phase] =
                    values[`phase_${phase}_completed_at`];
            } else if (phase.completedAt !== null) {
                terminatedPreparatoryPhases[phase.preparatoryPhaseId] =
                    phase.completedAt;
            }
        }
    }
    return terminatedPreparatoryPhases;
}

const hasPreparatoryPhases = computed(() => {
    return town.value?.preparatoryPhasesTowardResorption?.length > 0;
});

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues, "edit");

        /* eslint-disable no-unused-vars */
        let {
            updated_at: _1,
            update_to_date: _2,
            ...originalValuesRest
        } = originalValues;
        let {
            updated_at: _3,
            update_to_date: _4,
            ...formattedValuesRest
        } = formattedValues;
        /* eslint-enable no-unused-vars */

        if (
            // Cas où l'on souhaite indiquer qu'un site est à jour sans modifier de donnée
            mode.value === "edit" &&
            isDeepEqual(originalValuesRest, formattedValuesRest)
        ) {
            formattedValues.updated_without_any_change = true;
        } else {
            formattedValues.updated_without_any_change = false;
        }

        error.value = null;

        const notificationStore = useNotificationStore();
        try {
            let respondedTown;
            if (mode.value === "edit") {
                const { submit } = config[mode.value];
                respondedTown = await submit(formattedValues, town.value?.id);
            } else {
                const notificationStore = useNotificationStore();
                const { submit, notification } = config[mode.value];
                respondedTown = await submit(formattedValues, town.value?.id);

                notificationStore.success(
                    notification.title,
                    notification.content
                );
            }

            if (mode.value === "report") {
                backOrReplace("/liste-des-sites");
            } else {
                backOrReplace(`/site/${respondedTown.id}`);
            }
        } catch (e) {
            error.value = e?.user_message || "Une erreur inconnue est survenue";
            if (e?.fields) {
                const mergedErrors = { ...errors.value, ...e.fields };
                setErrors(mergedErrors);
            }

            notificationStore.error(
                "Echec de la création ou mise à jour du site",
                e?.user_message
            );
        }
    }),
    isSubmitting,
});
</script>
