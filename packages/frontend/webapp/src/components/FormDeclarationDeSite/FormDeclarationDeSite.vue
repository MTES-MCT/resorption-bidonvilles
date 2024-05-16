<template>
    <ArrangementLeftMenu :tabs="tabs" autonav>
        <template v-slot:menuTitle>Rubriques</template>
        <IndicationCaractereObligatoire />

        <FormDeclarationDeSiteInfo v-if="town === null" :mode="mode" />
        <FormDeclarationDeSiteDateDeMaj
            v-else-if="canSetUpdatedAt"
            :minDate="minUpdatedAt"
        />
        <FormDeclarationDeSiteAdresse :townId="town?.id" class="mt-6" />
        <FormDeclarationDeSiteCaracteristiques class="mt-6" />
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
import router from "@/helpers/router";
import isDeepEqual from "@/utils/isDeepEqual";
import backOrReplace from "@/utils/backOrReplace";
import formatFormTown from "@common/utils/formatFormTown";
import formatFormDate from "@common/utils/formatFormDate";

import { ErrorSummary } from "@resorptionbidonvilles/ui";
import ArrangementLeftMenu from "@/components/ArrangementLeftMenu/ArrangementLeftMenu.vue";
import FormDeclarationDeSiteInfo from "./sections/FormDeclarationDeSiteInfo.vue";
import FormDeclarationDeSiteDateDeMaj from "./sections/FormDeclarationDeSiteDateDeMaj.vue";
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
const { handleSubmit, values, errors, setErrors, isSubmitting } = useForm({
    validationSchema,
    initialValues,
});

const originalValues = formatValuesForApi(values);
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
            console.log("Failed fetching more information about the city");
        }
    }
});

const tabs = computed(() => {
    const arr = [
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

    return arr;
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
        notification: {
            title: "Mise à jour réussie",
            content: "Le site a bien été mis à jour",
        },
    },
};

function formatValuesForApi(v) {
    let citycode = null;
    let label = null;
    if (v.address?.data) {
        ({ citycode, label } = v.address.data);
    }

    return {
        ...Object.keys(validationSchema.value.fields).reduce((acc, key) => {
            acc[key] = v[key];
            return acc;
        }, {}),
        ...{
            living_conditions_version: v.living_conditions_version || 2,
            built_at: formatFormDate(v.built_at),
            declared_at: formatFormDate(v.declared_at),
            updated_at: v.updated_at || new Date(),
            census_conducted_at: formatFormDate(v.census_conducted_at),
            justice_rendered_at: formatFormDate(v.justice_rendered_at),
            police_requested_at: formatFormDate(v.police_requested_at),
            police_granted_at: formatFormDate(v.police_granted_at),
            census_status: v.census_status === "null" ? null : v.census_status,
            police_status: v.police_status === "null" ? null : v.police_status,
            citycode,
            address: label,
            coordinates: `${v.coordinates[0]},${v.coordinates[1]}`,
            // Nouveaux champs
            //evacuation_under_time_limit,
            administrative_order:
                v.administrative_order === null ? null : v.administrative_order,
            administrative_order_decision_at:
                v.administrative_order_decision_at === null
                    ? null
                    : formatFormDate(v.administrative_order_decision_at),
            // administrative_order_decision_rendered_by,
            administrative_order_evacuation_at:
                v.administrative_order_evacuation_at === null
                    ? null
                    : formatFormDate(v.administrative_order_evacuation_at),
            evacuation_police_status:
                v.evacuation_police_status === "null"
                    ? null
                    : v.evacuation_police_status,
            evacuation_police_requested_at:
                v.evacuation_police_requested_at === null
                    ? null
                    : formatFormDate(v.evacuation_police_requested_at),
            evacuation_police_granted_at:
                v.evacuation_police_granted_at === null
                    ? null
                    : formatFormDate(v.evacuation_police_granted_at),
            existing_litigation_status:
                v.existing_litigation_status === "null"
                    ? null
                    : v.existing_litigation_status,
            insalubrity_order_type:
                v.insalubrity_order_type === null
                    ? null
                    : v.insalubrity_order_type,
            insalubrity_order_by:
                v.insalubrity_order_by === null ? null : v.insalubrity_order_by,
            insalubrity_order_at:
                v.insalubrity_order_at === null
                    ? null
                    : formatFormDate(v.insalubrity_order_at),
            // insalubrity_parcels,
            insalubrity_police_status:
                v.insalubrity_police_status === "null"
                    ? null
                    : v.insalubrity_police_status,
            insalubrity_police_requested_at:
                v.insalubrity_police_requested_at === null
                    ? null
                    : formatFormDate(v.insalubrity_police_requested_at),
            insalubrity_police_granted_at:
                v.insalubrity_police_granted_at === null
                    ? null
                    : formatFormDate(v.insalubrity_police_granted_at),
        },
    };
}

defineExpose({
    submit: handleSubmit(async (sentValues) => {
        const formattedValues = formatValuesForApi(sentValues);

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
            mode.value === "edit" &&
            isDeepEqual(originalValuesRest, formattedValuesRest)
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
            const respondedTown = await submit(formattedValues, town.value?.id);

            notificationStore.success(notification.title, notification.content);
            if (mode.value === "report") {
                backOrReplace("/liste-des-sites");
            } else {
                backOrReplace(`/site/${respondedTown.id}`);
            }
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
